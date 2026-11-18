// Package quiet decides whether non-urgent messages should be held for the night.
package quiet

import "time"

// Window is a daily quiet period that may wrap past midnight.
type Window struct {
	StartHour int
	EndHour   int
	Location  *time.Location
}

// Contains reports whether t falls inside the quiet window.
func (w Window) Contains(t time.Time) bool {
	h := t.In(w.Location).Hour()
	if w.StartHour == w.EndHour {
		return false
	}
	if w.StartHour < w.EndHour {
		return h >= w.StartHour && h < w.EndHour
	}
	return h >= w.StartHour || h < w.EndHour
}

// NextOpen returns the first instant at or after t that is outside the window.
func (w Window) NextOpen(t time.Time) time.Time {
	if !w.Contains(t) {
		return t
	}
	local := t.In(w.Location)
	open := time.Date(local.Year(), local.Month(), local.Day(), w.EndHour, 0, 0, 0, w.Location)
	if !open.After(local) {
		open = open.AddDate(0, 0, 1)
	}
	return open
}
