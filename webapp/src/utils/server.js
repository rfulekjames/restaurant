import {
  showSuccessNotification,
  showPendingNotification,
  showErrorNotification,
  errorMessage,
} from "./notifications";
import { reservationsActions } from "../store/reservations-slice";
import { authActions } from "../store/auth-slice";
import { tablesActions } from "../store/tables-slice";
import { AUTO_LOGIN_PATH } from "../components/Layout/Navigation";


import { getAccessTokenFromSessionStorage, setAccessTokenInSessionStorage } from "./window-methods";
import { FetchedReservationsTypeEnum} from "./helper";

const FETCH_REQUEST_TIMEOUT = 10000;
const SERVER_URL = 'http://localhost:9000/api';
const CREATE_USER_PATH = '/users/register';
const USERNAME_PATH = '/users/username';
const LOGIN_PATH = '/users/login';
const RESTAURANTS_PATH = '/restaurants';
const reservationsUrl = (restaurantName) => `${RESTAURANTS_PATH}/${restaurantName}/reservations`;
const tablesUrl = (restaurantName) => `${RESTAURANTS_PATH}/${restaurantName}/tables`;


async function executeServerRequest(path, method, payload) {
  var headers = {
    'Content-Type': 'application/json',
  }
  const accessToken = getAccessTokenFromSessionStorage();
  if (accessToken && accessToken !== 'null') {
    headers = { ...headers, 'Authorization': `Bearer ${accessToken}` };
  }
  const requestParams = payload ? { method, headers, body: JSON.stringify(payload) } : { method, headers };
  return await fetchWithTimeout(SERVER_URL + path, requestParams, FETCH_REQUEST_TIMEOUT);
}

async function fetchWithTimeout(url, requestParams, timeout) {
  const abortSignal = AbortSignal.timeout(timeout);
  abortSignal.throwIfAborted();
  const res = await fetch(url, { ...requestParams, signal: abortSignal });
  if (res.status >= 500) throw new Error(`Server side error for request ${url}.`);
  if (res.status === 401) throw new Error('Invalid credentials!');
  if (res.status >= 400) {
    const body = await res.json();
    throw new Error(`Client side error for request ${url}:${body.errorCode}`);
  }
  return await res.json();
}

export const createUser = async (userToCreate, history, dispatch) => {
  showPendingNotification(dispatch, "Sending user data!");
  try {
    var { accessToken } = await executeServerRequest(CREATE_USER_PATH, 'POST', userToCreate);
    setAccessTokenInSessionStorage(accessToken);
  } catch (error) {
    showErrorNotification(
      dispatch,
      errorMessage("Error with user creation!", error.message),
    );
    return;
  }

  try {
    await executeServerRequest(USERNAME_PATH, 'POST', { username: userToCreate.username });
    setAccessTokenInSessionStorage(null);
  } catch (error) {
    showErrorNotification(
      dispatch,
      errorMessage("Error with username creation!", error.message),
    );
    return;
  }

  await authenticateUser(userToCreate, dispatch);
  history.push(AUTO_LOGIN_PATH);
};

export const authenticateUser = async (userToAuth, dispatch) => {
  showPendingNotification(dispatch, "Sending user data!");
  try {
    const { userId, accessToken } = await executeServerRequest(LOGIN_PATH, 'POST', { email: userToAuth.email, password: userToAuth.password });
    setAccessTokenInSessionStorage(accessToken);
    if (await fetchUsernameIfNeededAndUpdateAuthState(
      userToAuth,
      userId,
      dispatch,
    )) showSuccessNotification(dispatch, "User logged in successfully!");
  } catch (error) {
    showErrorNotification(
      dispatch,
      errorMessage("Error with the login!", error.message)
    );
  }
}

export const fetchTables = async (restaurantName, dispatch) => {
  showPendingNotification(dispatch, "Getting tables!");
  try {
    const { tables } = await executeServerRequest(tablesUrl(restaurantName), 'GET');
    dispatch(tablesActions.setTables(tables));
    showSuccessNotification(dispatch, "Tables fetched successfully!");
  } catch (error) {
    showErrorNotification(
      dispatch,
      errorMessage("Error with getting tables!", error.message),
    );
  }
}

export const createTable = async (tableToCreate, dispatch) => {
  showPendingNotification(dispatch, "Sending table data!");
  try {
    await executeServerRequest(tablesUrl(tableToCreate.restaurantName), 'POST', {
      column: tableToCreate.column,
      row: tableToCreate.row,
      size: tableToCreate.size,
      tableId: tableToCreate.id,
    });
    dispatch(tablesActions.updateTable(tableToCreate));
    showSuccessNotification(dispatch, "The table created successfully!");
  } catch (error) {
    showErrorNotification(
      dispatch,
      errorMessage("Error with creating the table!", error.message)
    );
  }
};

export const deleteTable = async (tableToDelete, dispatch) => {
  showPendingNotification(dispatch, "Sending table data!");
  try {
    await executeServerRequest(tablesUrl(tableToDelete.restaurantName), 'DELETE', {
      tableId: tableToDelete.id,
    });
    dispatch(tablesActions.deleteTable(tableToDelete.id));
    showSuccessNotification(dispatch, "The table deleted successfully!");
  } catch (error) {
    showErrorNotification(
      dispatch,
      errorMessage("Error with deleting the table!", error.message)
    );
  }
};

export const logout = (dispatch) => {
  try {
    setAccessTokenInSessionStorage(null);
    dispatch(authActions.logoutUser());
    showSuccessNotification(dispatch, "User logged out successfully!");
  } catch (error) {
    showErrorNotification(
      dispatch,
      errorMessage("Error with logging out!", error.message)
    );
  };
};

export const createReservation = async (
  reservationData,
  reservationsType,
  dispatch,
) => {
  showPendingNotification(dispatch, "Sending reservation data!");
  try {
    const reservation = {
      contactDetails: reservationData.contactDetails,
      customerName: reservationData.customerName,
      date: reservationData.date,
      time: reservationData.time,
      id: reservationData.id,
      tableId: reservationData.tableId,
    };
    await executeServerRequest(reservationsUrl(reservationData.restaurantName), 'POST', reservation);
    dispatch(
      reservationsActions.updateTableReservations({
        reservation,
        type: reservationsType,
      })
    );
    showSuccessNotification(
      dispatch,
      "The reservation created successfully!"
    );
  } catch (error) {
    showErrorNotification(
      dispatch,
      errorMessage("Error with creating the reservation!", error.message)
    );
  }
};

export const getReservationsForTable = async (
  restaurantName,
  tableId,
  reservationsType, // FetchedReservationsTypeEnum
  dispatch
) => {
  showPendingNotification(dispatch, "Getting reservations!");
  try {
    const ascDesc =
      reservationsType === FetchedReservationsTypeEnum.FUTURE ? "asc" : "desc";
    const { reservations } = await executeServerRequest(`${reservationsUrl(restaurantName)}/${tableId}?ascDesc=${ascDesc}`, 'GET');
    dispatch(
      reservationsActions.setTableReservations({
        reservations,
        type: reservationsType,
      })
    );
    showSuccessNotification(dispatch, "Reservations fetched successfully!");
  } catch (error) {
    showErrorNotification(
      dispatch,
      errorMessage("Error with getting reservations!", error.message)
    );
  };
};

export const fetchAllReservationsForDate = async (
  restaurantName,
  date,
  dispatch
) => {
  showPendingNotification(dispatch, "Getting reservations!");
  try {
    const { reservations } = await executeServerRequest(`${reservationsUrl(restaurantName)}?date=${date}`, 'GET');
    dispatch(
      reservationsActions.setReservationsReporting(reservations)
    );
    showSuccessNotification(dispatch, "Reservations fetched successfully!");
  } catch (error) {
    showErrorNotification(
      dispatch,
      errorMessage("Error with getting reservations!", error.message)
    );
  }
};

export const deleteReservation = async (reservationToDelete, dispatch) => {
  showPendingNotification(dispatch, "Sending reservation data!");
  try {
    await executeServerRequest(reservationsUrl(reservationToDelete.restaurantName),
      'DELETE', { reservationId: reservationToDelete.id, tableId: reservationToDelete.tableId });
    dispatch(
      reservationsActions.deleteReservation(reservationToDelete.id)
    );
    showSuccessNotification(
      dispatch,
      "The reservation deleted successfully!"
    );
  } catch (error) {
    showErrorNotification(
      dispatch,
      errorMessage("Error with deleting the reservation!", error.message)
    );
  }
};

async function fetchUsernameIfNeededAndUpdateAuthState(
  userToAuth,
  userId,
  dispatch
) {
  if (!userToAuth.username) {
    try {
      const { username } = await executeServerRequest(USERNAME_PATH, 'GET');
      dispatch(authActions.loginUser({
        username,
        uid: userId,
      })
      );
    }
    catch (error) {
      showErrorNotification(
        dispatch,
        errorMessage("Error with getting the username!", error.message)
      );
      return false;
    }
  } else {
    dispatch(authActions.loginUser({ ...userToAuth, userId }));
  }
  return true;
}
