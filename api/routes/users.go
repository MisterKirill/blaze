package routes

import (
	"encoding/json"
	"net/http"
	"os"
	"strings"

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

	resp, err := http.Get(os.Getenv("MEDIAMTX_API_URL") + "/v3/paths/get/live/" + user.Username)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to get stream information"})
		return
	}

	switch resp.StatusCode {
	case http.StatusOK:
		json.NewEncoder(w).Encode(map[string]any{
			"username":     user.Username,
			"bio":          user.Bio,
			"display_name": user.DisplayName,
			"stream": map[string]any{
				"name": user.StreamName,
				"url":  os.Getenv("MEDIAMTX_HLS_URL") + "/live/" + user.Username + "/index.m3u8",
			},
		})

	case http.StatusNotFound:
		json.NewEncoder(w).Encode(map[string]any{
			"username":     user.Username,
			"bio":          user.Bio,
			"display_name": user.DisplayName,
			"stream":       nil,
		})

	default:
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to get stream info"})
	}
}

func Search(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("query")
	if query == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Search query not provided"})
		return
	}

	if len(query) < 3 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]string{"error": "Search query must be at least 3 characters"})
		return
	}

	query = strings.ReplaceAll(query, "%", "\\%")
	query = strings.ReplaceAll(query, "_", "\\_")

	var users []struct {
		Username    string  `json:"username"`
		DisplayName *string `json:"display_name"`
	}
	db.DB.
		Model(&db.User{}).
		Limit(50).
		Find(&users, "username ILIKE ? OR display_name ILIKE ? ESCAPE '\\'", "%"+query+"%", "%"+query+"%")

	json.NewEncoder(w).Encode(map[string]any{
		"users": users,
	})
}
