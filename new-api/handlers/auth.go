package handlers

import "github.com/gofiber/fiber/v3"

func RegisterHandler(c fiber.Ctx) error {
	return c.SendString("Register")
}

func LoginHandler(c fiber.Ctx) error {
	return c.SendString("Login")
}
