package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"net/mail"
	"strings"

	"github.com/MisterKirill/blaze/api/models"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func SearchUsersHandler(c *fiber.Ctx, db *sql.DB) error {
	query := c.Query("query")

	query = strings.ReplaceAll(query, "%", "")
	query = strings.ReplaceAll(query, "_", "")

	if query == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Query not found",
		})
	}

	rows, err := db.Query(
		"SELECT username, bio, display_name, stream_name FROM users WHERE username ILIKE $1 OR display_name ILIKE $1 LIMIT 50",
		"%"+query+"%",
	)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get users",
		})
	}

	users := make([]models.SafeUser, 0)

	for rows.Next() {
		var user models.SafeUser
		if err := rows.Scan(&user.Username, &user.Bio, &user.DisplayName, &user.StreamName); err != nil {
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to get users",
			})
		}
		users = append(users, user)
	}

	return c.JSON(fiber.Map{
		"users": users,
	})
}

func GetUserHandler(c *fiber.Ctx, db *sql.DB) error {
	username := c.Params("username")
	if username == "" {
		return c.Status(http.StatusBadRequest).JSON(fiber.Map{
			"error": "Username not found",
		})
	}

	var user models.SafeUser
	err := db.QueryRow(
		"SELECT username, bio, display_name, stream_name FROM users WHERE username = $1",
		username,
	).Scan(&user.Username, &user.Bio, &user.DisplayName, &user.StreamName)
	if err == sql.ErrNoRows {
		return c.Status(http.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get user",
		})
	}

	return c.JSON(user)
}

func GetMeHandler(c *fiber.Ctx, db *sql.DB) error {
	user := c.Locals("user").(models.User)
	authorizedUser := models.AuthorizedUser{
		Username:    user.Username,
		Email:       user.Email,
		Bio:         user.Bio,
		DisplayName: user.DisplayName,
		StreamName:  user.StreamName,
		StreamKey:   fmt.Sprintf("%d?k=%s", user.ID, user.StreamKey),
	}
	return c.JSON(authorizedUser)
}

func UpdateMeHandler(c *fiber.Ctx, db *sql.DB) error {
	user := c.Locals("user").(models.User)

	var body struct {
		Email       *string `json:"email"`
		Bio         *string `json:"bio"`
		DisplayName *string `json:"display_name"`
		StreamName  *string `json:"stream_name"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse body",
		})
	}

	if body.Email != nil {
		if _, err := mail.ParseAddress(*body.Email); err != nil {
			return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
				"error": "Invalid email format",
			})
		}

		user.Email = *body.Email
	}

	if body.Bio != nil {
		if len(*body.Bio) > 1000 {
			return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
				"error": "Bio must be at most 1000 characters",
			})
		}

		user.Bio = body.Bio
	}

	if body.DisplayName != nil {
		if len(*body.DisplayName) > 50 {
			return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
				"error": "Display name must be at most 50 characters",
			})
		}

		user.DisplayName = body.DisplayName
	}

	if body.StreamName != nil {
		if len(*body.StreamName) > 50 {
			return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
				"error": "Stream name must be at most 50 characters",
			})
		}

		user.StreamName = body.StreamName
	}

	var safeUser models.SafeUser
	err := db.QueryRow(
		"UPDATE users SET email = $1, bio = $2, display_name = $3, stream_name = $4 WHERE id = $5 RETURNING username, bio, display_name, stream_name",
		user.Email,
		user.Bio,
		user.DisplayName,
		user.StreamName,
		user.ID,
	).Scan(&safeUser.Username, &safeUser.Bio, &safeUser.DisplayName, &safeUser.StreamName)
	if err != nil {
		log.Print(err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user",
		})
	}

	return c.JSON(safeUser)
}

func FollowUserHandler(c *fiber.Ctx, db *sql.DB) error {
	user := c.Locals("user").(models.User)
	targetUsername := c.Params("username")

	if user.Username == targetUsername {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "You can't follow yourself",
		})
	}

	var targetID int
	err := db.QueryRow("SELECT id FROM users WHERE username = $1", targetUsername).Scan(&targetID)
	if err == sql.ErrNoRows {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get user",
		})
	}

	_, err = db.Exec("INSERT INTO follows (follower_id, follows_id) VALUES ($1, $2)", user.ID, targetID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to follow",
		})
	}

	return c.SendStatus(fiber.StatusCreated)
}

func UnfollowUserHandler(c *fiber.Ctx, db *sql.DB) error {
	user := c.Locals("user").(models.User)
	targetUsername := c.Params("username")

	if user.Username == targetUsername {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "You can't unfollow yourself",
		})
	}

	var targetID int
	err := db.QueryRow("SELECT id FROM users WHERE username = $1", targetUsername).Scan(&targetID)
	if err == sql.ErrNoRows {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	} else if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get user",
		})
	}

	_, err = db.Exec("DELETE FROM follows WHERE follower_id = $1 AND follows_id = $2", user.ID, targetID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to unfollow",
		})
	}

	return c.SendStatus(fiber.StatusOK)
}

func UpdatePassword(c *fiber.Ctx, db *sql.DB) error {
	user := c.Locals("user").(models.User)

	var body struct {
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse body",
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.OldPassword)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid old password",
		})
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(body.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash password",
		})
	}

	_, err = db.Exec("UPDATE users SET password = $1 WHERE id = $2", passwordHash, user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update password",
		})
	}

	return c.SendStatus(fiber.StatusOK)
}
