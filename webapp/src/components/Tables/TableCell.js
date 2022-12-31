import DragableCard from "../UI/DraggableCard";
import DroppableBoard from "../UI/DroppableBoard";

const EMPTY_CELL_SYMBOL = "0";

export function getDraggableCardId(cellData) {
  return (
    cellData.row +
    "_" +
    cellData.column +
    "_" +
    cellData.tableId +
    "_" +
    cellData.size
  );
}

function TableCell(props) {
  const clickHandler = () => {
    props.onCellClick(props.cellData);
  };

  const filled = props.cellData.tableId ? true : false;

  return (
    <DroppableBoard
      onClick={clickHandler}
      id={props.cellData.row + "_" + props.cellData.column}
      onDrop={props.onDrop}
      isDragStart={props.isDragStart}
      filled={filled}
    >
      <DragableCard
        id={getDraggableCardId(props.cellData)}
        draggable={props.draggable && filled}
        enabled={filled || props.draggable}
        onDragStart={props.onDragStart}
        onDragEnd={props.onDragEnd}
        isDragged={props.isDragStart}
      > {props.cellData.tableId ? props.cellData.tableId + '/' : ""}
        {props.cellData.size ? <b>{props.cellData.size}</b> : EMPTY_CELL_SYMBOL}
      </DragableCard>
    </DroppableBoard>
  );
}

export default TableCell;
