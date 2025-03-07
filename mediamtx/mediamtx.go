package mediamtx

import (
	"fmt"
	"net/http"
)

type MediamtxAPI struct {
	apiUrl string
}

func New(apiUrl string) (MediamtxAPI, error) {
	resp, err := http.Get(apiUrl + "/v3/config/global/get")
	if err != nil {
		return MediamtxAPI{}, fmt.Errorf("failed to get MediaMTX configuration. Is MediaMTX API running on %s? %s", apiUrl, err.Error())
	}

	if resp.StatusCode != http.StatusOK {
		return MediamtxAPI{}, fmt.Errorf("failed to get MediaMTX configuration. Is MediaMTX API running on %s?", apiUrl)
	}

	return MediamtxAPI{
		apiUrl: apiUrl,
	}, nil
}
