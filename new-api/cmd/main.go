package main

import (
	"fmt"
	"log"

	"github.com/MisterKirill/blaze/api/config"
	"github.com/MisterKirill/blaze/api/database"
	"github.com/MisterKirill/blaze/api/routes"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	db, err := database.ConnectDatabase(cfg)
	if err != nil {
		log.Fatalf("Failed to connect database: %v", err)
	}
	
	app := fiber.New()
	app.Use(logger.New())

	routes.SetupRoutes(app, db)

	app.Listen(fmt.Sprintf(":%d", cfg.Server.Port))
}
