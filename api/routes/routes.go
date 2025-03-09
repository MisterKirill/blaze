package routes

import (
	"database/sql"

	"github.com/MisterKirill/blaze/api/config"
	"github.com/MisterKirill/blaze/api/handlers"
	"github.com/MisterKirill/blaze/api/middleware"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, db *sql.DB, cfg *config.Config) {
	app.Post("/auth/register", func(c *fiber.Ctx) error {
		return handlers.RegisterHandler(c, db, cfg)
	})
	app.Post("/auth/login", func(c *fiber.Ctx) error {
		return handlers.LoginHandler(c, db, cfg)
	})
	app.Post("/auth/mediamtx", func(c *fiber.Ctx) error {
		return handlers.MediaMTXAuthHandler(c)
	})
	app.Get("/users", func(c *fiber.Ctx) error {
		return handlers.SearchUsersHandler(c, db)
	})
	app.Get("/users/me", middleware.JwtMiddleware(db, cfg), func(c *fiber.Ctx) error {
		return handlers.GetMeHandler(c, db)
	})
	app.Patch("/users/me", middleware.JwtMiddleware(db, cfg), func(c *fiber.Ctx) error {
		return handlers.UpdateMeHandler(c, db)
	})
	app.Put("/users/me/password", middleware.JwtMiddleware(db, cfg), func(c *fiber.Ctx) error {
		return handlers.UpdatePassword(c, db)
	})
	app.Get("/users/:username", func(c *fiber.Ctx) error {
		return handlers.GetUserHandler(c, db)
	})
	app.Get("/streams/active", func(c *fiber.Ctx) error {
		return handlers.GetActiveStreamsHandler(c, db, cfg)
	})
	app.Post("/users/:username/follow", middleware.JwtMiddleware(db, cfg), func(c *fiber.Ctx) error {
		return handlers.FollowUserHandler(c, db)
	})
	app.Post("/users/:username/unfollow", middleware.JwtMiddleware(db, cfg), func(c *fiber.Ctx) error {
		return handlers.UnfollowUserHandler(c, db)
	})
	app.Get("/users/:username/chat", middleware.JwtMiddleware(db, cfg), websocket.New(func(c *websocket.Conn) {
		handlers.WebSocketChatHandler(c, db)
	}))
}
