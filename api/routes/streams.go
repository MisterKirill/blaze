package routes

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/MisterKirill/blaze/api/db"
	"github.com/MisterKirill/go-mediamtx/mediamtx"
)

type Stream struct {
	StreamName  *string `json:"stream_name"`
	DisplayName *string `json:"display_name"`
	Username    string  `json:"username"`
	Viewers     int     `json:"viewers"`
}

func GetStreams(w http.ResponseWriter, r *http.Request) {
	client, err := mediamtx.New(os.Getenv("MEDIAMTX_API_URL"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to get streams information",
		})
		return
	}

	paths, err := client.GetPaths()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to get streams information",
		})
		return
	}

	streams := make([]Stream, 0)

	for _, path := range paths {
		viewers := len(path.Readers)
		username := path.Name[5:]

		var user db.User
		db.DB.First(&user, "username = ?", username)

		streams = append(streams, Stream{
			StreamName:  user.StreamName,
			DisplayName: user.DisplayName,
			Username:    user.Username,
			Viewers:     viewers,
		})
	}

	json.NewEncoder(w).Encode(map[string]any{
		"streams": streams,
	})
}
