package handlers

import (
	"database/sql"
	"math/rand"
	"net/mail"
	"regexp"
	"time"

	"github.com/MisterKirill/blaze/api/config"
	"github.com/gofiber/fiber/v3"
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

func RegisterHandler(c fiber.Ctx, db *sql.DB, cfg *config.Config) error {
	var body struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.Bind().JSON(&body); err != nil {
		return err
	}

	if !CheckUsername(body.Username) {
		return c.JSON(fiber.Map{
			"error": "Username may contain only letters, numbers and underscores",
		})
	}

	if len(body.Username) < 3 {
		return c.JSON(fiber.Map{
			"error": "Username must be at least 3 characters",
		})
	}

	if len(body.Username) > 50 {
		return c.JSON(fiber.Map{
			"error": "Username must be at most 50 characters",
		})
	}

	if len(body.Password) < 8 {
		return c.JSON(fiber.Map{
			"error": "Password must be at least 8 characters",
		})
	}

	if _, err := mail.ParseAddress(body.Email); err != nil {
		return c.JSON(fiber.Map{
			"error": "Invalid email format",
		})
	}

	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)", body.Username).Scan(&exists)
	if err != nil {
		return err
	}
	if exists {
		return c.JSON(fiber.Map{
			"error": "Username is already taken",
		})
	}

	err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", body.Email).Scan(&exists)
	if err != nil {
		return err
	}
	if exists {
		return c.JSON(fiber.Map{
			"error": "Email is already in use",
		})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
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
		return err
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
		return err
	}

	return c.JSON(fiber.Map{
		"token": tokenString,
	})
}

func LoginHandler(c fiber.Ctx) error {
	return c.SendString("Login")
}
