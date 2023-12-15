import { push } from 'redux-first-history';
import { addToast } from 'app/actions/ToastActions';
import callAPI from 'app/actions/callAPI';
import {
  eventSchema,
  eventAdministrateSchema,
  followersEventSchema,
} from 'app/reducers';
import createQueryString from 'app/utils/createQueryString';
import { Event } from './ActionTypes';
import type { EventRegistrationPresence } from 'app/models';
import type { AppDispatch } from 'app/store/createStore';
import type { ID } from 'app/store/models';
import type {
  DetailedEvent,
  ListEvent,
  UnknownEvent,
} from 'app/store/models/Event';
import type { Thunk, Action } from 'app/types';

export const waitinglistPoolId = -1;
export function fetchEvent(eventId: string) {
  return callAPI<DetailedEvent>({
    types: Event.FETCH,
    endpoint: `/events/${eventId}/`,
    schema: eventSchema,
    meta: {
      errorMessage: 'Henting av hendelse feilet',
    },
    propagateError: true,
  });
}
export function fetchPrevious(): Thunk<any> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Event.FETCH_PREVIOUS,
        endpoint: '/events/previous/',
        schema: [eventSchema],
        meta: {
          errorMessage: 'Henting av hendelser feilet',
        },
        propagateError: true,
      })
    );
}
export function fetchUpcoming(): Thunk<any> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Event.FETCH_UPCOMING,
        endpoint: '/events/upcoming/',
        schema: [eventSchema],
        meta: {
          errorMessage: 'Henting av hendelser feilet',
        },
        propagateError: true,
      })
    );
}

export const fetchData = ({
  dateAfter,
  dateBefore,
  refresh,
  loadNextPage,
  pagination,
  dispatch,
}: {
  dateAfter?: string;
  dateBefore?: string;
  refresh?: boolean;
  loadNextPage?: boolean;
  pagination: any;
  dispatch: AppDispatch;
}) => {
  const query = {
    date_after: dateAfter,
    date_before: dateBefore,
  };

  if (dateBefore && dateAfter) {
    query.page_size = 60;
  }

  const queryString = createQueryString(query);
  const endpoint = getEndpoint(pagination, queryString, loadNextPage);

  if (!endpoint) {
    return Promise.resolve(null);
  }

  if (refresh && !loadNextPage) {
    dispatch({
      type: Event.CLEAR,
    });
  }

  dispatch(fetchList({ endpoint, queryString }));
};

const getEndpoint = (
  pagination: any,
  queryString: string,
  loadNextPage?: boolean
) => {
  let endpoint = `/events/${queryString}`;
  const paginationObject = pagination[queryString];

  if (
    loadNextPage &&
    paginationObject &&
    paginationObject.queryString === queryString &&
    paginationObject.nextPage
  ) {
    endpoint = paginationObject.nextPage;
  }

  return endpoint;
};

export const fetchList = ({
  endpoint,
  queryString,
}: {
  endpoint: string;
  queryString: string;
}) => {
  return callAPI<ListEvent[]>({
    types: Event.FETCH,
    endpoint: endpoint,
    schema: [eventSchema],
    meta: {
      errorMessage: 'Fetching events failed',
      queryString,
      endpoint,
    },
    propagateError: true,
  });
};

export function fetchAdministrate(eventId: number): Thunk<any> {
  return callAPI({
    types: Event.FETCH,
    endpoint: `/events/${eventId}/administrate/`,
    schema: eventAdministrateSchema,
    meta: {
      errorMessage: 'Henting av registreringer feilet',
    },
  });
}

export function fetchAllergies(eventId: number): Thunk<any> {
  return callAPI({
    types: Event.FETCH,
    endpoint: `/events/${eventId}/allergies/`,
    schema: eventAdministrateSchema,
    meta: {
      errorMessage: 'Henting av allergier feilet',
    },
  });
}

export function createEvent(event: Record<string, any>) {
  return (dispatch: AppDispatch) =>
    dispatch(
      callAPI<UnknownEvent>({
        types: Event.CREATE,
        endpoint: '/events/',
        method: 'POST',
        body: event,
        schema: eventSchema,
        meta: {
          errorMessage: 'Opprettelse av hendelse feilet',
        },
      })
    ).then(
      (action) =>
        'success' in action &&
        dispatch(push(`/events/${action.payload.result}/`))
    );
}
export function editEvent(event: Record<string, any>): Thunk<Promise<any>> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Event.EDIT,
        endpoint: `/events/${event.id}/`,
        method: 'PUT',
        body: { ...event, cover: event.cover || undefined },
        meta: {
          errorMessage: 'Endring av hendelse feilet',
        },
      })
    ).then(() => dispatch(push(`/events/${event.id}`)));
}
export function deleteEvent(eventId: number): Thunk<Promise<any>> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Event.DELETE,
        endpoint: `/events/${eventId}/`,
        method: 'DELETE',
        meta: {
          id: eventId,
          errorMessage: 'Sletting av hendelse feilet',
        },
      })
    ).then(() => {
      dispatch(
        addToast({
          message: 'Deleted',
        })
      );
      dispatch(push('/events'));
    });
}

export function register({
  eventId,
  captchaResponse,
  feedback,
  userId,
}: {
  eventId: number;
  captchaResponse: string;
  feedback: string;
  userId: number;
}): Thunk<any> {
  return callAPI({
    types: Event.REQUEST_REGISTER,
    endpoint: `/events/${eventId}/registrations/`,
    method: 'POST',
    body: {
      captchaResponse,
      feedback,
    },
    meta: {
      id: eventId,
      userId,
      errorMessage: 'Registering til hendelse feilet',
    },
  });
}
export function unregister({
  eventId,
  registrationId,
  userId,
  admin = false,
}: {
  eventId: number;
  registrationId: number;
  userId: number;
  admin: boolean;
}): Thunk<any> {
  return callAPI({
    types: Event.REQUEST_UNREGISTER,
    endpoint: `/events/${eventId}/registrations/${registrationId}/`,
    method: 'DELETE',
    body: {},
    meta: {
      errorMessage: 'Avregistrering fra hendelse feilet',
      admin,
      userId,
      id: Number(registrationId),
    },
  });
}
export function adminRegister(
  eventId: number,
  userId: number,
  poolId: number | undefined,
  feedback: string,
  adminRegistrationReason: string
): Thunk<any> {
  return callAPI({
    types: Event.ADMIN_REGISTER,
    endpoint: `/events/${eventId}/registrations/admin_register/`,
    method: 'POST',
    body: {
      user: userId,
      pool: poolId === waitinglistPoolId ? undefined : poolId,
      adminRegistrationReason,
      feedback,
    },
    meta: {
      errorMessage: 'Admin registrering feilet',
      successMessage: 'Brukeren ble registrert',
    },
  });
}
export function payment(eventId: number): Thunk<any> {
  return callAPI({
    types: Event.PAYMENT_QUEUE,
    endpoint: `/events/${eventId}/payment/`,
    method: 'POST',
    meta: {
      errorMessage: 'Betaling feilet',
    },
  });
}
export function updateFeedback(
  eventId: number,
  registrationId: number,
  feedback: string
): Thunk<Promise<any>> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Event.UPDATE_REGISTRATION,
        endpoint: `/events/${eventId}/registrations/${registrationId}/`,
        method: 'PATCH',
        body: {
          feedback,
        },
        meta: {
          successMessage: 'Tilbakemelding oppdatert',
          errorMessage: 'Tilbakemelding oppdatering feilet',
        },
      })
    );
}
export function markUsernamePresent(
  eventId: number,
  username: string
): Thunk<Promise<any>> {
  return callAPI({
    types: Event.UPDATE_REGISTRATION,
    endpoint: `/events/${eventId}/registration_search/`,
    method: 'POST',
    body: {
      username,
    },
  });
}
export function updatePresence(
  eventId: number,
  registrationId: number,
  presence: EventRegistrationPresence
): Thunk<Promise<any>> {
  return callAPI({
    types: Event.UPDATE_REGISTRATION,
    endpoint: `/events/${eventId}/registrations/${registrationId}/`,
    method: 'PATCH',
    body: {
      presence,
    },
    meta: {
      successMessage: 'Tilstedeværelse oppdatert',
      errorMessage: 'Oppdatering av tilstedeværelse feilet',
    },
  });
}
export function updatePayment(
  eventId: number,
  registrationId: number,
  paymentStatus: string
): Thunk<Promise<Action | null | undefined>> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Event.UPDATE_REGISTRATION,
        endpoint: `/events/${eventId}/registrations/${registrationId}/`,
        method: 'PATCH',
        body: {
          paymentStatus,
        },
        meta: {
          errorMessage: 'Oppdatering av betaling feilet',
        },
      })
    ).then(() =>
      dispatch(
        addToast({
          message: 'Payment updated',
        })
      )
    );
}
export function follow(userId: number, eventId: number): Thunk<any> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Event.FOLLOW,
        enableOptimistic: true,
        endpoint: `/followers-event/`,
        schema: followersEventSchema,
        method: 'POST',
        body: {
          target: eventId,
          follower: userId,
        },
        meta: {
          errorMessage: 'Registrering av interesse feilet',
        },
      })
    );
}
export function unfollow(
  followId: number,
  eventId: number
): Thunk<Promise<any>> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Event.UNFOLLOW,
        endpoint: `/followers-event/${followId}/`,
        enableOptimistic: true,
        method: 'DELETE',
        meta: {
          id: followId,
          eventId,
          errorMessage: 'Avregistrering fra interesse feilet',
        },
      })
    );
}
export function isUserFollowing(eventId: number): Thunk<any> {
  return callAPI({
    types: Event.IS_USER_FOLLOWING,
    endpoint: `/followers-event/?target=${eventId}`,
    schema: [followersEventSchema],
    method: 'GET',
    meta: {
      errorMessage: 'Henting av interesse feilet',
    },
  });
}
export function fetchAnalytics(eventId: ID): Thunk<Promise<Action>> {
  return callAPI({
    types: Event.FETCH,
    endpoint: `/events/${String(eventId)}/statistics/`,
    method: 'GET',
    meta: {
      errorMessage: 'Henting av analyse feilet',
    },
  });
}
