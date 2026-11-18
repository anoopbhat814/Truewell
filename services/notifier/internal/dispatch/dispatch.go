// Package dispatch routes reminders to delivery channels with retry and throttling.
package dispatch

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/your-org/truewell/services/notifier/internal/quiet"
	"github.com/your-org/truewell/services/notifier/internal/ratelimit"
)

// Request is a single outbound message.
type Request struct {
	ID        string `json:"id"`
	Channel   string `json:"channel"`
	PatientID string `json:"patient_id"`
	Message   string `json:"message"`
	Urgent    bool   `json:"urgent"`
}

// Result describes what happened to a request.
type Result struct {
	ID       string    `json:"id"`
	Status   string    `json:"status"` // sent, deferred, throttled
	Attempts int       `json:"attempts"`
	SendAt   time.Time `json:"send_at,omitempty"`
}

// Sender delivers one message over a channel.
type Sender interface {
	Send(ctx context.Context, req Request, body string) error
}

// ErrPermanent marks failures that must not be retried.
var ErrPermanent = errors.New("permanent delivery failure")

// ErrThrottled is returned when a patient exceeds the per-minute limit.
var ErrThrottled = errors.New("rate limit exceeded")

// Dispatcher fans requests out to registered senders.
type Dispatcher struct {
	Senders  map[string]Sender
	Limiter  *ratelimit.Limiter
	Quiet    quiet.Window
	Attempts int
	Backoff  time.Duration
	Now      func() time.Time
	Sleep    func(time.Duration)
}

// Dispatch validates, throttles, defers during quiet hours and then delivers req.
func (d *Dispatcher) Dispatch(ctx context.Context, req Request) (Result, error) {
	res := Result{ID: req.ID}
	sender, ok := d.Senders[strings.ToUpper(req.Channel)]
	if !ok {
		return res, fmt.Errorf("unsupported channel %q: %w", req.Channel, ErrPermanent)
	}
	if strings.TrimSpace(req.Message) == "" {
		return res, fmt.Errorf("empty message: %w", ErrPermanent)
	}
	now := d.Now()
	if !d.Limiter.Allow(req.PatientID, now) {
		res.Status = "throttled"
		return res, ErrThrottled
	}
	if !req.Urgent && d.Quiet.Contains(now) {
		res.Status = "deferred"
		res.SendAt = d.Quiet.NextOpen(now)
		return res, nil
	}
	body := fit(req.Channel, req.Message)
	var err error
	for attempt := 1; attempt <= d.Attempts; attempt++ {
		res.Attempts = attempt
		if err = sender.Send(ctx, req, body); err == nil {
			res.Status = "sent"
			return res, nil
		}
		if errors.Is(err, ErrPermanent) || ctx.Err() != nil {
			break
		}
		d.Sleep(d.Backoff * time.Duration(1<<(attempt-1)))
	}
	return res, fmt.Errorf("delivery failed after %d attempts: %w", res.Attempts, err)
}

// fit trims text to the length limit of the channel (SMS 160 runes, push 120).
func fit(channel, text string) string {
	limit := map[string]int{"SMS": 160, "PUSH": 120}[strings.ToUpper(channel)]
	if r := []rune(text); limit > 0 && len(r) > limit {
		return string(r[:limit-1]) + "…"
	}
	return text
}
