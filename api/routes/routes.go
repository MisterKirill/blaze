package routes

import "github.com/go-chi/chi/v5"

func InitRoutes(r *chi.Mux) {
	r.Post("/session", Login)
	r.Post("/users", CreateUser)
	r.Get("/users/{username}", GetUser)

	r.Group(func(r chi.Router) {
		r.Use(AuthMiddleware)
		r.Put("/users/me", UpdateUser)
	})
}
