import { createSlice } from "@reduxjs/toolkit";

const tablesSlice = createSlice({
  name: "tables",
  initialState: {
    tables: [],
    newTableId: "1",
  },
  reducers: {
    updateTable(state, action) {
      const updatedOrAddedTable = action.payload;
      updateTables(state.tables, updatedOrAddedTable);
      updateNewTableId(state);
    },
    deleteTable(state, action) {
      const deletedTableId = action.payload;
      deleteTable(state, deletedTableId);
      updateNewTableId(state);
    },
    setTables(state, action) {
      const tables = action.payload;
      tables.sort((a, b) => (+a.id > +b.id ? 1 : -1));
      state.tables = tables;
      updateNewTableId(state);
    },
  },
});

function updateTables(tables, updatedOrAddedTable) {
  find: {
    for (const index in tables) {
      const table = tables[index];
      if (table.id === updatedOrAddedTable.id) {
        tables[index] = updatedOrAddedTable;
        break find;
      }
    }
    tables.push(updatedOrAddedTable);
  }
}

function deleteTable(state, deletedTableId) {
  const tables = state.tables;
  for (const index in tables) {
    const table = tables[index];
    if (table.id === deletedTableId) {
      const precedingTables = tables.slice(0, index);
      state.tables = precedingTables.concat(tables.slice(parseInt(index) + 1));
      break;
    }
  }
}

function updateNewTableId(state) {
  const setOfTableIds = new Set();
  for (const table of state.tables) {
    setOfTableIds.add(+table.id);
  }
  let index = 1;
  while (setOfTableIds.has(index)) {
    index++;
  }
  state.newTableId = index.toString();
}

export const tablesActions = tablesSlice.actions;

export default tablesSlice;
