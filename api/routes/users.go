package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"unicode/utf8"

	"github.com/MisterKirill/blaze/api/db"
	"github.com/go-chi/chi/v5"
)

func GetUser(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")

	var user db.User
	db.DB.First(&user, "username = ?", username)
	if user.ID == 0 {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(map[string]any{
		"username":     user.Username,
		"bio":          user.Bio,
		"display_name": user.DisplayName,
		"stream_name":  user.StreamName,
	})
}

func GetMe(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(UserKey).(db.User)
	json.NewEncoder(w).Encode(map[string]any{
		"username":     user.Username,
		"bio":          user.Bio,
		"display_name": user.DisplayName,
		"stream_name":  user.StreamName,
		"stream_token": fmt.Sprintf("%s?t=%s", user.Username, user.StreamToken),
	})
}

func UpdateMe(w http.ResponseWriter, r *http.Request) {
	var body struct {
		DisplayName *string `json:"display_name"`
		StreamName  *string `json:"stream_name"`
		Bio         *string
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON format!"})
		return
	}

	if body.DisplayName != nil && utf8.RuneCountInString(*body.DisplayName) > 40 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"display_name": "Display name length must be less than 40!",
		})
		return
	}

	if body.StreamName != nil && utf8.RuneCountInString(*body.StreamName) > 50 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"stream_name": "Stream name length must be less than 50!",
		})
		return
	}

	if body.Bio != nil && utf8.RuneCountInString(*body.Bio) > 500 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"bio": "Bio length must be less than 500!",
		})
		return
	}

	user := r.Context().Value(UserKey).(db.User)

	user.DisplayName = body.DisplayName
	user.StreamName = body.StreamName
	user.Bio = body.Bio

	db.DB.Save(&user)
}
