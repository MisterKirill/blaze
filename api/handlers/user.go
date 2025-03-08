package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"net/mail"
	"strings"

	"github.com/MisterKirill/blaze/api/models"
	"github.com/gofiber/fiber/v2"
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
		Email       string  `json:"email"`
		Bio         *string `json:"bio"`
		DisplayName *string `json:"display_name"`
		StreamName  *string `json:"stream_name"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Failed to parse body",
		})
	}

	if _, err := mail.ParseAddress(body.Email); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Invalid email format",
		})
	}

	if body.Bio != nil && len(*body.Bio) > 1000 {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Bio must be in between 1 and 1000 characters",
		})
	}

	if body.DisplayName != nil && len(*body.DisplayName) > 50 {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Display name must be in between 1 and 50 characters",
		})
	}

	if body.StreamName != nil && len(*body.StreamName) > 50 {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"error": "Stream name must be in between 1 and 50 characters",
		})
	}

	var safeUser models.SafeUser
	err := db.QueryRow(
		"UPDATE users SET email = $1, bio = $2, display_name = $3, stream_name = $4 WHERE id = $5 RETURNING username, bio, display_name, stream_name",
		body.Email,
		body.Bio,
		body.DisplayName,
		body.StreamName,
		user.ID,
	).Scan(&safeUser.Username, &safeUser.Bio, &safeUser.DisplayName, &safeUser.StreamName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update user",
		})
	}

	return c.JSON(safeUser)
}

func FollowUserHandler(c *fiber.Ctx) error {
	return c.SendString("FollowUserHandler")
}

func UnfollowUserHandler(c *fiber.Ctx) error {
	return c.SendString("UnfollowUserHandler")
}
