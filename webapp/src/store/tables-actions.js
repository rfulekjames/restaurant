import { createTable, fetchTables, deleteTable } from "../utils/firebase";

export const setTable = (tableToAdd) => {
  return async (dispatch) => {
    await createTable(tableToAdd, dispatch);
  };
};

export const removeTable = (tableToDelete) => {
  return async (dispatch) => {
    await deleteTable(tableToDelete, dispatch);
  };
};

export const getTables = (restarantName) => {
  return async (dispatch) => {
    await fetchTables(restarantName, dispatch);
  };
};
