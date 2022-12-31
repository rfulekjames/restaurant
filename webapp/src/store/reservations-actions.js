import {
  createReservation,
  getReservationsForTable,
  fetchAllReservationsForDate,
  deleteReservation,
} from "../utils/firebase";

export const setReservationAndUpdateReservations = (reservationData, reservationsType) => {
  return async (dispatch) => {
    await createReservation(reservationData, reservationsType, dispatch);
  };
};

export const getReservations = (
  restarantName,
  tableId,
  fechedReservationsTypeEnum
) => {
  return async (dispatch) => {
    await getReservationsForTable(
      restarantName,
      tableId,
      fechedReservationsTypeEnum,
      dispatch
    );
  };
};

export const removeReservation = (reservationData) => {
  return async (dispatch) => {
    await deleteReservation(reservationData, dispatch);
  };
};

export const getAllReservationsForDate = (restarantName, date) => {
  return async (dispatch) => {
    await fetchAllReservationsForDate(restarantName, date, dispatch);
  };
};
