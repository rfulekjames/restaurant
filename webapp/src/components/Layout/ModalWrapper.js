import React from "react";
import Card from "../UI/Card.js";
import classes from "./ModalWrapper.module.css";

const ModalWrapper = (props) => {
  return (
    <div>
      <div className={classes.backdrop} />
      <Card className={classes.modal}>
        <header className={classes.header}>
          <h2>{props.title}</h2>
        </header>
        <div className={classes.content}>
          <p><b>{props.description}</b></p>
          {props.children}
        </div>
      </Card>
    </div>
  );
};

export default ModalWrapper;
