from app.logging import configure_logging
from app.tasks.appointments import mark_no_shows, schedule_reminders
from app.tasks.lab_release import release_reviewed_results
from app.tasks.reminders import send_due_reminders
from app.tasks.scheduler import Job, Scheduler

if __name__ == "__main__":
    configure_logging()
    Scheduler(
        [
            Job("schedule_reminders", 300, schedule_reminders),
            Job("send_due_reminders", 30, send_due_reminders),
            Job("release_lab_results", 600, release_reviewed_results),
            Job("mark_no_shows", 900, mark_no_shows),
        ]
    ).run_forever()
