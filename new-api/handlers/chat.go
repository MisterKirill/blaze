package handlers

import "github.com/gofiber/fiber/v3"

func WebSocketChatHandler(c fiber.Ctx) error {
	return c.SendString("WebSocketChatHandler")
}
