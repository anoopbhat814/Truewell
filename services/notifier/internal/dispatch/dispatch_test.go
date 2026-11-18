package dispatch

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/your-org/truewell/services/notifier/internal/quiet"
	"github.com/your-org/truewell/services/notifier/internal/ratelimit"
)

func newDispatcher(now time.Time, sender Sender) *Dispatcher {
	return &Dispatcher{
		Senders:  map[string]Sender{"EMAIL": sender, "SMS": sender},
		Limiter:  ratelimit.New(2, time.Minute),
		Quiet:    quiet.Window{StartHour: 21, EndHour: 7, Location: time.UTC},
		Attempts: 3,
		Backoff:  time.Millisecond,
		Now:      func() time.Time { return now },
		Sleep:    func(time.Duration) {},
	}
}

var noon = time.Date(2025, 4, 10, 12, 0, 0, 0, time.UTC)

func TestDispatchSends(t *testing.T) {
	mem := &MemorySender{}
	res, err := newDispatcher(noon, mem).Dispatch(context.Background(), Request{ID: "r1", Channel: "email", PatientID: "p", Message: "hello"})
	if err != nil || res.Status != "sent" || res.Attempts != 1 {
		t.Fatalf("res=%+v err=%v", res, err)
	}
	if len(mem.Sent) != 1 {
		t.Fatalf("sent %d messages", len(mem.Sent))
	}
}

func TestDispatchRetriesTransientFailures(t *testing.T) {
	mem := &MemorySender{Fail: func(n int) error {
		if n < 3 {
			return errors.New("gateway timeout")
		}
		return nil
	}}
	res, err := newDispatcher(noon, mem).Dispatch(context.Background(), Request{ID: "r", Channel: "SMS", PatientID: "p", Message: "x"})
	if err != nil || res.Attempts != 3 {
		t.Fatalf("res=%+v err=%v", res, err)
	}
}

func TestDispatchStopsOnPermanentError(t *testing.T) {
	mem := &MemorySender{Fail: func(int) error { return ErrPermanent }}
	res, err := newDispatcher(noon, mem).Dispatch(context.Background(), Request{ID: "r", Channel: "SMS", PatientID: "p", Message: "x"})
	if !errors.Is(err, ErrPermanent) || res.Attempts != 1 {
		t.Fatalf("res=%+v err=%v", res, err)
	}
}

func TestQuietHoursDeferNonUrgent(t *testing.T) {
	night := time.Date(2025, 4, 10, 23, 0, 0, 0, time.UTC)
	d := newDispatcher(night, &MemorySender{})
	res, _ := d.Dispatch(context.Background(), Request{ID: "r", Channel: "EMAIL", PatientID: "p", Message: "x"})
	if res.Status != "deferred" || !res.SendAt.Equal(time.Date(2025, 4, 11, 7, 0, 0, 0, time.UTC)) {
		t.Fatalf("res=%+v", res)
	}
	urgent, _ := d.Dispatch(context.Background(), Request{ID: "u", Channel: "EMAIL", PatientID: "q", Message: "x", Urgent: true})
	if urgent.Status != "sent" {
		t.Fatalf("urgent message should bypass quiet hours: %+v", urgent)
	}
}

func TestThrottleAndValidation(t *testing.T) {
	d := newDispatcher(noon, &MemorySender{})
	req := Request{ID: "r", Channel: "EMAIL", PatientID: "p", Message: "x"}
	d.Dispatch(context.Background(), req)
	d.Dispatch(context.Background(), req)
	if _, err := d.Dispatch(context.Background(), req); !errors.Is(err, ErrThrottled) {
		t.Fatalf("want ErrThrottled, got %v", err)
	}
	if _, err := d.Dispatch(context.Background(), Request{Channel: "FAX", PatientID: "z", Message: "x"}); !errors.Is(err, ErrPermanent) {
		t.Fatalf("unsupported channel should be permanent, got %v", err)
	}
	if _, err := d.Dispatch(context.Background(), Request{Channel: "SMS", PatientID: "y", Message: "  "}); !errors.Is(err, ErrPermanent) {
		t.Fatalf("blank message should be permanent, got %v", err)
	}
}

func TestFitTruncatesByChannel(t *testing.T) {
	long := string(make([]rune, 400))
	if n := len([]rune(fit("sms", long))); n != 160 {
		t.Errorf("sms length = %d", n)
	}
	if fit("EMAIL", long) != long {
		t.Error("email must not be truncated")
	}
}
