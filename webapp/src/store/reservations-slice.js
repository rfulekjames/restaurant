import { createSlice } from "@reduxjs/toolkit";
import { FetchedReservationsTypeEnum } from "../utils/helper";

const reservationsSlice = createSlice({
  name: "reservations",
  initialState: {
    tableReservations: [],
    newReservationId: "1",
    reservationReporting: [],
  },
  reducers: {
    setTableReservations(state, action) {
      const reservations = action.payload.reservations;
      state.tableReservations = reservations;
      updateNewReservationId(state);
    },
    flipReservationsOrder(state) {
      const reversedTableReservations = [];
      const tableReservationsNumber = state.tableReservations.length;
      for (const index in state.tableReservations) {
        reversedTableReservations.push(
          state.tableReservations[tableReservationsNumber - 1 - +index]
        );
      }
      state.tableReservations = reversedTableReservations;
    },
    addReservationsReporting(state, action) {
      const reservations = action.payload;
      state.reservationReporting.push(reservations);
    },
    setReservationsReporting(state, action) {
      state.reservationReporting = action.payload;
    },
    removeReservationsReporting(state) {
      state.reservationReporting = [];
    },
    deleteReservation(state, action) {
      const deletedReservationId = action.payload;
      deleteReservation(state, deletedReservationId);
      updateNewReservationId(state);
    },
    updateTableReservations(state, action) {
      find: {
        const updatedReservation = action.payload.reservation;
        for (const index in state.tableReservations) {
          const reservation = state.tableReservations[index];
          if (reservation.id === updatedReservation.id) {
            state.tableReservations[index] = updatedReservation;
            break find;
          }
        }
        state.tableReservations.push(updatedReservation);
      }
      const reservationsType = action.payload.type;
      sortReservations(state.tableReservations, reservationsType);
      updateNewReservationId(state);
    },
  },
});

const updateNewReservationId = (state) => {
  let maximumId = 0;
  for (const reservation of state.tableReservations) {
    maximumId = Math.max(+reservation.id, maximumId);
  }
  const newId = maximumId + 1;
  state.newReservationId = newId.toString();
};

function sortReservations(reservations, reservationsType) {
  let multiplier = 1;
  if (reservationsType === FetchedReservationsTypeEnum.PAST) {
    multiplier = -1;
  }

  reservations.sort((a, b) =>
    a.date > b.date
      ? 1 * multiplier
      : a.date === b.date
      ? a.time > b.time
        ? 1 * multiplier
        : -1 * multiplier
      : -1 * multiplier
  );
}

function deleteReservation(state, deletedReservationId) {
  const reservations = state.tableReservations;
  for (const index in reservations) {
    const reservation = reservations[index];
    if (reservation.id === deletedReservationId) {
      const precedingReservations = reservations.slice(0, index);
      state.tableReservations = precedingReservations.concat(
        reservations.slice(parseInt(index) + 1)
      );
      break;
    }
  }
}

export const reservationsActions = reservationsSlice.actions;

export default reservationsSlice;
