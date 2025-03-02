package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
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
		http.Error(w, `{"error": "Invalid JSON format"}`, http.StatusBadRequest)
		return
	}

	if body.DisplayName != nil && utf8.RuneCountInString(*body.DisplayName) > 40 {
		http.Error(w, `{"bio": "Display name should be at most 40 characters"}`, http.StatusUnprocessableEntity)
		return
	}

	if body.StreamName != nil && utf8.RuneCountInString(*body.StreamName) > 50 {
		http.Error(w, `{"stream_name": "Stream name should be at most 50 characters"}`, http.StatusUnprocessableEntity)
		return
	}

	if body.Bio != nil && utf8.RuneCountInString(*body.Bio) > 500 {
		http.Error(w, `{"bio": "Bio should be at most 500 characters"}`, http.StatusUnprocessableEntity)
		return
	}

	user := r.Context().Value(UserKey).(db.User)

	user.DisplayName = body.DisplayName
	user.StreamName = body.StreamName
	user.Bio = body.Bio

	db.DB.Save(&user)
}

func Search(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("query")
	if query == "" {
		http.Error(w, `{"error": "Search query not provided"}`, http.StatusBadRequest)
		return
	}

	if len(query) < 3 {
		http.Error(w, `{"error": "Search query must be at least 3 characters"}`, http.StatusBadRequest)
		return
	}

	query = strings.ReplaceAll(query, "%", "\\%")
	query = strings.ReplaceAll(query, "_", "\\_")

	var users []struct {
		Username    string `json:"username"`
		DisplayName *string `json:"display_name"`
	}
	db.DB.
		Model(&db.User{}).
		Limit(50).
		Find(&users, "username ILIKE ? OR display_name ILIKE ? ESCAPE '\\'", "%" + query + "%", "%" + query + "%")

	json.NewEncoder(w).Encode(map[string]any{
		"total": len(users),
		"users": users,
	})
}
