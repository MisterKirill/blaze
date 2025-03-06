package routes

import (
	"database/sql"

	"github.com/MisterKirill/blaze/api/handlers"
	"github.com/gofiber/fiber/v3"
)

func SetupRoutes(app *fiber.App, db *sql.DB) {
	app.Post("/auth/register", func (c fiber.Ctx) error {
		return handlers.RegisterHandler(c, db)
	})
	app.Post("/auth/login", handlers.LoginHandler)
	app.Get("/users", handlers.SearchUsersHandler)
	app.Get("/users/:username", handlers.GetUserHandler)
	app.Get("/streams/active", handlers.GetActiveStreamsHandler)
	app.Get("/users/me", handlers.GetMeHandler)
	app.Put("/users/me", handlers.UpdateMeHandler)
	app.Post("/users/:username/follow", handlers.FollowUserHandler)
	app.Post("/users/:username/unfollow", handlers.UnfollowUserHandler)
	app.Get("/users/:username/chat", handlers.WebSocketChatHandler)
}
