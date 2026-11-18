import { actionsApi, createApi } from '@truewell/api-client';

/** Browser-side API client. Cookies carry the session, so no token handling is needed here. */
export const api = createApi();
export const actions = actionsApi(api.http);
