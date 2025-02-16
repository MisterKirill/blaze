package routes

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/mail"
	"os"
	"regexp"
	"time"
	"unicode/utf8"

	"github.com/MisterKirill/blaze/api/db"
	"github.com/go-chi/chi/v5"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var CheckUsername = regexp.MustCompile("^[a-zA-Z0-9_]+$").MatchString

func Login(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email    string
		Password string
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if _, err := mail.ParseAddress(body.Email); err != nil {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"error": "Email must be an email",
		})
		return
	}

	if utf8.RuneCountInString(body.Password) < 8 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"error": "Password length must be 8 or greater",
		})
		return
	}

	var user db.User
	db.DB.First(&user, "email = ?", body.Email)

	if user.ID == 0 {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{
			"error": "Invalid email or password",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{
			"error": "Invalid email or password",
		})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": fmt.Sprint(user.ID),
		"iat": time.Now().Unix(),
		"exp": time.Now().AddDate(0, 1, 0).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		HttpOnly: true,
	})
	w.WriteHeader(http.StatusNoContent)
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Username string
		Email    string
		Password string
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	usernameLength := utf8.RuneCountInString(body.Username)

	if usernameLength < 3 || usernameLength > 40 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"error": "Username length must be in between 3 and 40",
		})
		return
	}

	if !CheckUsername(body.Username) {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"error": "Username may contain only English letters, numbers and underscores",
		})
		return
	}

	if _, err := mail.ParseAddress(body.Email); err != nil {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"error": "Email must be an email",
		})
		return
	}

	if utf8.RuneCountInString(body.Password) < 8 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"error": "Password length must be 8 or greater",
		})
		return
	}

	var usernameCheck db.User
	db.DB.First(&usernameCheck, "username = ?", body.Username)

	if usernameCheck.ID != 0 {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]any{
			"error": "This username is already in use",
		})
		return
	}

	var emailCheck db.User
	db.DB.First(&emailCheck, "email = ?", body.Email)

	if emailCheck.ID != 0 {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]any{
			"error": "This email is already in use",
		})
		return
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	user := db.User{
		Username: body.Username,
		Email:    body.Email,
		Password: string(passwordHash),
	}

	db.DB.Create(&user)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"iat": time.Now().Unix(),
		"exp": time.Now().AddDate(0, 1, 0).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		HttpOnly: true,
	})
	w.WriteHeader(http.StatusNoContent)
}

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
		"display_name": user.DisplayName,
		"stream_name":  user.StreamName,
		"bio":          user.Bio,
	})
}

func UpdateUser(w http.ResponseWriter, r *http.Request) {
	var body struct {
		DisplayName *string `json:"display_name"`
		StreamName  *string `json:"stream_name"`
		Bio         *string
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	if body.DisplayName != nil && utf8.RuneCountInString(*body.DisplayName) > 40 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"error": "Display name length must be less than 40",
		})
		return
	}

	if body.StreamName != nil && utf8.RuneCountInString(*body.StreamName) > 50 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"error": "Stream name length must be less than 50",
		})
		return
	}

	if body.Bio != nil && utf8.RuneCountInString(*body.Bio) > 500 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"error": "Bio length must be less than 500",
		})
		return
	}

	user := r.Context().Value(UserKey).(db.User)

	user.DisplayName = body.DisplayName
	user.StreamName = body.StreamName
	user.Bio = body.Bio

	db.DB.Save(&user)
}
