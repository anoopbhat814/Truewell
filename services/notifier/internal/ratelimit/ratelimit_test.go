package ratelimit

import (
	"testing"
	"time"
)

func TestAllowAndExpire(t *testing.T) {
	l := New(2, time.Minute)
	base := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)
	if !l.Allow("p1", base) || !l.Allow("p1", base.Add(time.Second)) {
		t.Fatal("first two events must pass")
	}
	if l.Allow("p1", base.Add(2*time.Second)) {
		t.Fatal("third event inside the window must be rejected")
	}
	if !l.Allow("p2", base.Add(2*time.Second)) {
		t.Fatal("keys are independent")
	}
	if !l.Allow("p1", base.Add(61*time.Second)) {
		t.Fatal("old events must expire")
	}
}

func TestRemaining(t *testing.T) {
	l := New(3, time.Minute)
	now := time.Now()
	l.Allow("k", now)
	if got := l.Remaining("k", now); got != 2 {
		t.Fatalf("Remaining = %d, want 2", got)
	}
	l.Allow("k", now)
	l.Allow("k", now)
	if got := l.Remaining("k", now); got != 0 {
		t.Fatalf("Remaining = %d, want 0", got)
	}
}
