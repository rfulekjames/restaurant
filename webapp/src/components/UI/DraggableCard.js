import classes from "./DraggableCard.module.css";

function DragableCard(props) {
  const dragOverHandler = (e) => {
    if (props.draggable) {
      e.stopPropagation();
    }
  };

  const dragStartHandler = (event) => {
    props.onDragStart(event);
  };

  const dragEndHandler = (event) => {
    props.onDragEnd(event);
  };

  return (
    <div
      id={props.id}
      className={`${classes.card} ${
        props.isDragged ? classes.hidden : classes.shown
      }   ${
        props.draggable
          ? classes.grabbable
          : props.enabled
          ? classes.pointing
          : ""
      } `}
      draggable={props.draggable}
      onDragStart={dragStartHandler}
      onDragOver={dragOverHandler}
      onDragEnd={dragEndHandler}
    >
      {props.children}
    </div>
  );
}

export default DragableCard;
