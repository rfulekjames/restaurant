import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    notification: null,
    tableToEdit: null,
    draggedTableData: null,
    reservationToEdit: null,
  },
  reducers: {
    showNotification(state, action) {
      state.notification = action.payload;
    },
    dismissNotification(state) {
      state.notification = null;
    },
    setTableToEdit(state, action) {
      state.tableToEdit = action.payload;
    },
    dismissTableToEdit(state) {
      state.tableToEdit = null;
    },
    setDraggedTableData(state, action) {
      state.draggedTableData = action.payload;
    },
    dismissDraggedTableData(state) {
      state.draggedTableData = null;
    },
    setReservationToEdit(state, action) {
      state.reservationToEdit = {
        id: action.payload.id,
        customerName: action.payload.customerName,
        contactDetails: action.payload.contactDetails,
        date: action.payload.date,
        time: action.payload.time,
      };
    },
    dismissReservationToEdit(state) {
      state.reservationToEdit = null;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
