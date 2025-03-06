package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/MisterKirill/blaze/api/handlers"
)

func SetupRoutes(app *fiber.App) {
	app.Post("/auth/register", handlers.RegisterHandler)
	app.Post("/auth/login", handlers.LoginHandler)
	app.Get("/users/search", handlers.SearchUsersHandler)
	app.Get("/users/:username", handlers.GetUserHandler)
	app.Get("/streams/active", handlers.GetActiveStreamsHandler)
	app.Get("/users/me", handlers.GetMeHandler)
	app.Put("/users/me", handlers.UpdateMeHandler)
	app.Post("/users/:username/follow", handlers.FollowUserHandler)
	app.Post("/users/:username/unfollow", handlers.UnfollowUserHandler)
	app.Get("/users/:username/chat", handlers.WebSocketChatHandler)
}
