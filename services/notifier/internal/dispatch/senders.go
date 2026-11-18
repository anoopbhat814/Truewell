package dispatch

import (
	"context"
	"log/slog"
	"sync"
)

// LogSender writes messages to the structured log. It is the default sender in development,
// where no real e-mail, SMS or push gateway is configured. Message bodies are never logged.
type LogSender struct {
	Channel string
	Logger  *slog.Logger
}

// Send implements Sender.
func (s LogSender) Send(_ context.Context, req Request, body string) error {
	s.Logger.Info("notification dispatched", "channel", s.Channel, "id", req.ID, "patient", req.PatientID, "chars", len(body))
	return nil
}

// MemorySender records deliveries; used by tests and the dry-run mode.
type MemorySender struct {
	mu   sync.Mutex
	Sent []Request
	Fail func(attempt int) error
	n    int
}

// Send implements Sender.
func (m *MemorySender) Send(_ context.Context, req Request, _ string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.n++
	if m.Fail != nil {
		if err := m.Fail(m.n); err != nil {
			return err
		}
	}
	m.Sent = append(m.Sent, req)
	return nil
}
