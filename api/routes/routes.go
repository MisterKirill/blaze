package routes

import "github.com/go-chi/chi/v5"

func InitRoutes(r *chi.Mux) {
	r.Post("/users", CreateUser)
	r.Post("/session", Login)
}
