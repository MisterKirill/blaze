package handlers

import "github.com/gofiber/fiber/v2"

func GetActiveStreamsHandler(c *fiber.Ctx) error {
	return c.SendString("GetActiveStreamsHandler")
}
