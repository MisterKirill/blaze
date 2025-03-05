package routes

import "github.com/go-chi/chi/v5"

func InitRoutes(r *chi.Mux) {
	r.Post("/auth/login", Login)
	r.Post("/auth/register", Register)
	r.Post("/auth/mediamtx", AuthMediamtx)

	r.Get("/users/{username}", GetUser)
	r.Get("/users", SearchUsers)

	r.Get("/streams", GetStreams)

	r.Group(func(r chi.Router) {
		r.Use(AuthMiddleware)
		r.Get("/me", GetMe)
		r.Put("/me", UpdateMe)
		r.Patch("/me/password", UpdatePassword)
	})
}
