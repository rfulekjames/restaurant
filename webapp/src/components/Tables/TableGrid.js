import TableCell from "./TableCell";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { setTable } from "../../store/tables-actions";
import classes from "./TableGrid.module.css";
import { uiActions } from "../../store/ui-slice";

const WIDTH = 15;
const HEIGHT = 10;

function getCellKey(rowIndex, columnIndex) {
  return rowIndex.toString() + "_" + columnIndex.toString();
}

function getTablesData(tables) {
  const setOfTableCells = new Set();
  const tablesData = {};
  for (const table of tables) {
    const cellKey = getCellKey(table.row, table.column);
    setOfTableCells.add(cellKey);
    tablesData[cellKey] = {
      size: table.size,
      tableId: table.id,
    };
  }
  return tablesData;
}

export default function TableGrid(props) {
  const dispatch = useDispatch();
  const tables = useSelector((state) => state.tables.tables);
  const draggedTableData = useSelector((state) => state.ui.draggedTableData);

  const tablesData = getTablesData(tables);
  const restaurantName = props.restaurantName;

  const dragStartHandler = (event) => {
    const target = event.target;
    const tableDataArray = target.id.split("_");
    const draggedTableData = {
      row: tableDataArray[0],
      column: tableDataArray[1],
      size: tableDataArray[3],
      tableId: tableDataArray[2],
    };

    setTimeout(() => {
      dispatch(uiActions.setDraggedTableData(draggedTableData));
    }, 0);
  };

  const dragEndHandler = (event) => {
    dispatch(uiActions.dismissDraggedTableData());
  };

  const dropHandler = (event) => {
    event.preventDefault();
    const target = event.target;
    const tablePositionArray = target.id.split("_");
    const updatedTable = {
      row: +tablePositionArray[0],
      column: +tablePositionArray[1],
      size: +draggedTableData.size,
      id: draggedTableData.tableId,
      restaurantName: restaurantName,
    };

    dispatch(setTable(updatedTable));
    dispatch(uiActions.dismissDraggedTableData());
  };

  const colIndices = [...Array(WIDTH).keys()];
  const rowIndices = [...Array(HEIGHT).keys()];

  const addTableRow = (rowIndex) => {
    return (
      <tr key={"row" + rowIndex}>
        {colIndices.map((item, colIndex) => {
          const cellKey = getCellKey(rowIndex, colIndex);
          const tableId = tablesData[cellKey]
            ? tablesData[cellKey].tableId
            : null;
          const size = tablesData[cellKey] ? tablesData[cellKey].size : null;
          const isDragStart =
            draggedTableData && tableId === draggedTableData.tableId;

          const cellData = {
            tableId: tableId,
            row: rowIndex,
            column: colIndex,
            size: size,
          };
          return (
            <td key={cellKey} className={`${classes.cell}`}>
              <TableCell
                draggable={props.draggableCells}
                cellData={cellData}
                onCellClick={props.onTableClick}
                onDragStart={dragStartHandler}
                onDragEnd={dragEndHandler}
                onDrop={dropHandler}
                isDragStart={isDragStart}
              ></TableCell>
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div className="container">
      <h3 className="text-center">{props.gridInfo + " " + restaurantName}</h3>
      <br />
      <table className="table  table-dark">
        <tbody>
          {rowIndices.map((item, rowIndex) => {
            return addTableRow(rowIndex);
          })}
        </tbody>
      </table>
    </div>
  );
}
