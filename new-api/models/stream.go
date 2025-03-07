package models

type ActiveStream struct {
	Url          string   `json:"url"`
	ViewersCount int      `json:"viewers_count"`
	User         SafeUser `json:"user"`
}
