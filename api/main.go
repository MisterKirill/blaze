package main

import (
	"log"
	"net/http"

	"github.com/MisterKirill/blaze/api/db"
	"github.com/MisterKirill/blaze/api/routes"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("Failed to load .env")
	}

	db.InitDB();

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	routes.InitRoutes(r)

	log.Println("Starting server on port 8080")
	http.ListenAndServe(":8080", r)
}
