// Package ratelimit implements a per-key sliding-window limiter.
package ratelimit

import (
	"sync"
	"time"
)

// Limiter allows at most Max events per key within Window.
type Limiter struct {
	Max    int
	Window time.Duration

	mu     sync.Mutex
	events map[string][]time.Time
}

// New builds a limiter.
func New(max int, window time.Duration) *Limiter {
	return &Limiter{Max: max, Window: window, events: make(map[string][]time.Time)}
}

// Allow records an event for key at now and reports whether it is within the limit.
func (l *Limiter) Allow(key string, now time.Time) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	cutoff := now.Add(-l.Window)
	kept := l.events[key][:0]
	for _, t := range l.events[key] {
		if t.After(cutoff) {
			kept = append(kept, t)
		}
	}
	if len(kept) >= l.Max {
		l.events[key] = kept
		return false
	}
	l.events[key] = append(kept, now)
	return true
}

// Remaining reports how many more events key may emit at now.
func (l *Limiter) Remaining(key string, now time.Time) int {
	l.mu.Lock()
	defer l.mu.Unlock()
	cutoff := now.Add(-l.Window)
	n := 0
	for _, t := range l.events[key] {
		if t.After(cutoff) {
			n++
		}
	}
	if n >= l.Max {
		return 0
	}
	return l.Max - n
}
