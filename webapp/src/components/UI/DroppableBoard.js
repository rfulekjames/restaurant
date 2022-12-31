import classes from "./DroppableBoard.module.css";

function DroppableBoard(props) {
  const dragOverHandler = (e) => {
    if ((!props.filled) || props.isDragStart) {
      e.preventDefault();
    }
  };

  return (
    <div
      className={`${props.filled ? classes.filled : classes.free }`}
      id={props.id}
      onDrop={props.onDrop}
      onDragOver={dragOverHandler}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
}

export default DroppableBoard;
