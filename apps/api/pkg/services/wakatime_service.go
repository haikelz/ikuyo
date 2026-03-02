package services

import (
	"ekel-backend/pkg/entities"
	"ekel-backend/pkg/utils"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"sync"
)

type WakatimeService struct {
}

func NewWakatimeService() *WakatimeService {
	return &WakatimeService{}
}

type Response struct {
	Body []byte
	Err  error
}

func getWakatimeStats(ch chan *Response, wg *sync.WaitGroup) {
	defer wg.Done()

	req, err := http.NewRequest("GET", utils.Env().WAKATIME_API_URL, nil)
	if err != nil {
		ch <- &Response{
			Body: nil,
			Err:  err,
		}
		return
	}
	req.Header.Add("Authorization", "Basic "+utils.Env().WAKATIME_API_KEY)
	req.Header.Add("Content-Type", "application/json")

	response, err := http.DefaultClient.Do(req)
	if err != nil {
		ch <- &Response{
			Body: nil,
			Err:  err,
		}
	}
	defer response.Body.Close()

	body, err := io.ReadAll(response.Body)
	if err != nil {
		ch <- &Response{
			Body: nil,
			Err:  err,
		}
	}

	ch <- &Response{
		Body: body,
		Err:  nil,
	}
}

func (s *WakatimeService) GetWakatimeStats() (*entities.WakaTimeResponse, error) {
	wg := &sync.WaitGroup{}
	ch := make(chan *Response, 1)

	wg.Add(1)
	go getWakatimeStats(ch, wg)
	wg.Wait()
	close(ch)

	response := <-ch
	if response.Err != nil {
		return nil, errors.New("failed to get Wakatime stats")
	}

	var wakatimeResponse entities.WakaTimeResponse

	err := json.Unmarshal(response.Body, &wakatimeResponse)
	if err != nil {
		return nil, err
	}

	return &wakatimeResponse, nil
}
