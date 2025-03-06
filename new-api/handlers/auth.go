package handlers

import (
	"database/sql"

	"github.com/gofiber/fiber/v3"
)

func RegisterHandler(c fiber.Ctx, db *sql.DB) error {
	var body struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := c.Bind().JSON(&body); err != nil {
		return err
	}

	_, err := db.Exec("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", body.Username, body.Email, body.Password)
	if err != nil {
	    return err
	}

	return c.JSON(fiber.Map{
		"message": "User registered successfully",
	})
}

func LoginHandler(c fiber.Ctx) error {
	return c.SendString("Login")
}
