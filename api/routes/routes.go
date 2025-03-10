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
	api := app.Group("/api/v1")
	
	auth := api.Group("/auth")
	auth.Post("/register", func(c *fiber.Ctx) error {
		return handlers.RegisterHandler(c, db, cfg)
	})
	auth.Post("/login", func(c *fiber.Ctx) error {
		return handlers.LoginHandler(c, db, cfg)
	})
	auth.Post("/mediamtx", func(c *fiber.Ctx) error {
		return handlers.MediaMTXAuthHandler(c, db)
	})

	users := api.Group("/users")
	users.Get("/", func(c *fiber.Ctx) error {
		return handlers.SearchUsersHandler(c, db)
	})
	users.Get("/me", middleware.JwtMiddleware(db, cfg), func(c *fiber.Ctx) error {
		return handlers.GetMeHandler(c, db)
	})
	users.Patch("/me", middleware.JwtMiddleware(db, cfg), func(c *fiber.Ctx) error {
		return handlers.UpdateMeHandler(c, db)
	})
	users.Put("/me/password", middleware.JwtMiddleware(db, cfg), func(c *fiber.Ctx) error {
		return handlers.UpdatePasswordHandler(c, db)
	})
	users.Get("/:username", func(c *fiber.Ctx) error {
		return handlers.GetUserHandler(c, db)
	})
	users.Post("/:username/follow", middleware.JwtMiddleware(db, cfg), func(c *fiber.Ctx) error {
		return handlers.FollowUserHandler(c, db)
	})
	users.Post("/:username/unfollow", middleware.JwtMiddleware(db, cfg), func(c *fiber.Ctx) error {
		return handlers.UnfollowUserHandler(c, db)
	})
	users.Get("/:username/chat", middleware.JwtMiddleware(db, cfg), websocket.New(func(c *websocket.Conn) {
		handlers.WebSocketChatHandler(c, db)
	}))

	streams := api.Group("/streams")
	streams.Get("/active", func(c *fiber.Ctx) error {
		return handlers.GetActiveStreamsHandler(c, db, cfg)
	})
}
