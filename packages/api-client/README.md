# @truewell/api-client

Typed browser/server client for the Truewell web API. One factory function per resource, plus
`actionsApi` for state transitions such as joining a telehealth session or submitting a claim.

```ts
import { createApi, actionsApi } from '@truewell/api-client';

const api = createApi({ baseUrl: '' });
const upcoming = await api.appointments.list({ status: 'CONFIRMED' });
const ticket = await actionsApi(api.http).joinSession(upcoming.items[0].id);
```

Errors are raised as `ApiError` carrying the `code`, `message` and optional `details` returned by the API.
