import { configureStore } from "@reduxjs/toolkit";

import authSlice from "./auth-slice";
import reservationsSlice from "./reservations-slice";
import tablesSlice from "./tables-slice";
import uiSlice from "./ui-slice";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    reservations: reservationsSlice.reducer,
    tables: tablesSlice.reducer,
    ui: uiSlice.reducer,
  },
});

export default store;
