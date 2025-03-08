package models

type ActiveStream struct {
	Url          string   `json:"url"`
	ViewersCount int      `json:"viewers_count"`
	ReadyTime    string   `json:"ready_time"`
	User         SafeUser `json:"user"`
}
