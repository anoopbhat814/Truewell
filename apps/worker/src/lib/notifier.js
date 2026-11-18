'use strict';

const DEFAULT_TIMEOUT_MS = 5000;

class NotifierError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'NotifierError';
    this.status = status;
    // 4xx other than 429 are permanent: retrying will not help.
    this.permanent = status >= 400 && status < 500 && status !== 429;
  }
}

function createNotifier({ baseUrl = process.env.NOTIFIER_URL, token = process.env.NOTIFIER_API_TOKEN, fetchImpl = fetch } = {}) {
  if (!baseUrl) throw new Error('NOTIFIER_URL is required');
  return {
    async dispatch(payload) {
      const res = await fetchImpl(`${baseUrl}/v1/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      });
      if (!res.ok) throw new NotifierError(`notifier responded ${res.status}`, res.status);
      return res.json();
    },
  };
}

module.exports = { createNotifier, NotifierError };
