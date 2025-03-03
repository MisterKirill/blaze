package routes

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"net/mail"
	"os"
	"regexp"
	"time"
	"unicode/utf8"

	"github.com/MisterKirill/blaze/api/db"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var CheckUsername = regexp.MustCompile("^[a-zA-Z0-9_]+$").MatchString
var seededRand *rand.Rand = rand.New(rand.NewSource(time.Now().UnixNano()))

func GenerateStreamToken() string {
	charset := "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"
	b := make([]byte, 32)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func Login(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email    string
		Password string
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON format!"})
		return
	}

	if _, err := mail.ParseAddress(body.Email); err != nil {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"email": "Invalid email format!",
		})
		return
	}

	if utf8.RuneCountInString(body.Password) < 8 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"password": "Password length must be 8 or greater!",
		})
		return
	}

	var user db.User
	result := db.DB.First(&user, "email = ?", body.Email)

	if result.Error != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"email": "Invalid email or password!",
		})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]any{
			"email": "Invalid email or password!",
		})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":      fmt.Sprint(user.ID),
		"iat":      time.Now().Unix(),
		"exp":      time.Now().AddDate(0, 1, 0).Unix(),
		"username": user.Username,
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenString,
	})
}

func Register(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Username string
		Email    string
		Password string
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON format!"})
		return
	}

	usernameLength := utf8.RuneCountInString(body.Username)

	if usernameLength < 3 || usernameLength > 40 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"username": "Username length must be in between 3 and 40!",
		})
		return
	}

	if !CheckUsername(body.Username) {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"username": "Username may only contain English letters, numbers and underscores!",
		})
		return
	}

	if _, err := mail.ParseAddress(body.Email); err != nil {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"email": "Invalid email format!",
		})
		return
	}

	if utf8.RuneCountInString(body.Password) < 8 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]any{
			"password": "Password length must be 8 or greater!",
		})
		return
	}

	var usernameCheck db.User
	db.DB.First(&usernameCheck, "username = ?", body.Username)

	if usernameCheck.ID != 0 {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]any{
			"username": "This username is already in use!",
		})
		return
	}

	var emailCheck db.User
	db.DB.First(&emailCheck, "email = ?", body.Email)

	if emailCheck.ID != 0 {
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]any{
			"email": "This email is already in use!",
		})
		return
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(body.Password), bcrypt.DefaultCost)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"password": "Failed to hash password. Please, try again.",
		})
		return
	}

	user := db.User{
		Username:    body.Username,
		Email:       body.Email,
		Password:    string(passwordHash),
		StreamToken: GenerateStreamToken(),
	}

	db.DB.Create(&user)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":      fmt.Sprint(user.ID),
		"iat":      time.Now().Unix(),
		"exp":      time.Now().AddDate(0, 1, 0).Unix(),
		"username": user.Username,
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenString,
	})
}

func AuthMediamtx(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Path  string
		Query string
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid JSON format!"})
		return
	}

	if len(body.Path) < 6 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid path length!"})
		return
	}

	if len(body.Query) < 3 {
		w.WriteHeader(http.StatusUnprocessableEntity)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid query length!"})
		return
	}

	username := body.Path[5:]
	token := body.Query[2:]

	if username == "" || token == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	var user db.User
	db.DB.First(&user, "username = ? AND stream_token = ?", username, token)

	if user.ID == 0 {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
}
