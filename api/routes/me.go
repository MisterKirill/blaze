package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"unicode/utf8"

	"github.com/MisterKirill/blaze/api/db"
	"golang.org/x/crypto/bcrypt"
)

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
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON format"})
		return
	}

	if body.DisplayName != nil && utf8.RuneCountInString(*body.DisplayName) > 40 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]string{"error": "Display name should be at most 40 characters"})
		return
	}

	if body.StreamName != nil && utf8.RuneCountInString(*body.StreamName) > 50 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]string{"error": "Stream name should be at most 50 characters"})
		return
	}

	if body.Bio != nil && utf8.RuneCountInString(*body.Bio) > 500 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]string{"error": "Bio should be at most 500 characters"})
		return
	}

	user := r.Context().Value(UserKey).(db.User)

	user.DisplayName = body.DisplayName
	user.StreamName = body.StreamName
	user.Bio = body.Bio

	db.DB.Save(&user)
}

func UpdatePassword(w http.ResponseWriter, r *http.Request) {
	var body struct {
		OldPassword string `json:"old_password"`
		NewPassword string `json:"new_password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON format!"})
		return
	}

	user := r.Context().Value(UserKey).(db.User)

	if utf8.RuneCountInString(body.NewPassword) < 8 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"password": "New password length must be 8 or greater!",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.OldPassword)); err != nil {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]string{"old_password": "Invalid old password!"})
		return
	}

	newPasswordHash, err := bcrypt.GenerateFromPassword([]byte(body.NewPassword), bcrypt.DefaultCost)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"old_password": "Failed to update password!"})
		return
	}

	user.Password = string(newPasswordHash)
	db.DB.Save(&user)
}
