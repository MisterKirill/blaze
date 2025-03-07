package handlers

import (
	"database/sql"
	"math/rand"
	"net/http"
	"net/mail"
	"regexp"
	"time"

	"github.com/MisterKirill/blaze/api/config"
	"github.com/MisterKirill/blaze/api/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

var CheckUsername = regexp.MustCompile("^[a-zA-Z0-9_]+$").MatchString

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

func generateRandomString(length int) string {
	result := make([]byte, length)
	for i := range result {
		result[i] = letters[rand.Intn(len(letters))]
	}
	return string(result)
}

func RegisterHandler(c *fiber.Ctx, db *sql.DB, cfg *config.Config) error {
	var body struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse body",
		})
	}

	if !CheckUsername(body.Username) {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Username may contain only letters, numbers and underscores",
		})
	}

	if len(body.Username) < 3 {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Username must be at least 3 characters",
		})
	}

	if len(body.Username) > 50 {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Username must be at most 50 characters",
		})
	}

	if len(body.Password) < 8 {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Password must be at least 8 characters",
		})
	}

	if _, err := mail.ParseAddress(body.Email); err != nil {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Invalid email format",
		})
	}

	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)", body.Username).Scan(&exists)
	if err != nil {
		return err
	}
	if exists {
		return c.Status(http.StatusConflict).JSON(fiber.Map{
			"error": "Username is already taken",
		})
	}

	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", body.Email).Scan(&exists)
	if err != nil {
		return err
	}
	if exists {
		return c.Status(http.StatusConflict).JSON(fiber.Map{
			"error": "Email is already in use",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash password",
		})
	}

	streamKey := generateRandomString(32)

	var id int
	err = db.QueryRow(
		"INSERT INTO users (username, email, password, stream_key) VALUES ($1, $2, $3, $4) RETURNING id",
		body.Username,
		body.Email,
		hashedPassword,
		streamKey,
	).Scan(&id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to insert user",
		})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": id,
		"sub":     body.Username,
		"iat":     time.Now().Unix(),
		"exp":     time.Now().AddDate(0, 1, 0).Unix(),
	})

	secret := []byte(cfg.JwtSecret)
	tokenString, err := token.SignedString(secret)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to sign JWT",
		})
	}

	return c.JSON(fiber.Map{
		"token": tokenString,
	})
}

func LoginHandler(c *fiber.Ctx, db *sql.DB, cfg *config.Config) error {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse body",
		})
	}

	if len(body.Password) < 8 {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Password must be at least 8 characters",
		})
	}

	if _, err := mail.ParseAddress(body.Email); err != nil {
		return c.Status(http.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Invalid email format",
		})
	}

	var user models.User
	err := db.QueryRow("SELECT id, username, password FROM users WHERE email = $1", body.Email).Scan(
		&user.ID,
		&user.Username,
		&user.Password,
	)
	if err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		return c.Status(http.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"sub":     user.Username,
		"iat":     time.Now().Unix(),
		"exp":     time.Now().AddDate(0, 1, 0).Unix(),
	})

	secret := []byte(cfg.JwtSecret)
	tokenString, err := token.SignedString(secret)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to sign JWT",
		})
	}

	return c.JSON(fiber.Map{
		"token": tokenString,
	})
}
