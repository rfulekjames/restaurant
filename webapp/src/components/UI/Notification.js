function Notification(props) {
  const notificationDismissHandler = (event) => {
    event.preventDefault();
    props.notificationDismiss();
  };

  return (
    <div className={`alert alert-${props.status}`}>
      <h4> {props.title}</h4>
      {props.message}
      {props.status === "danger" && (
        <button
          id="dismissButton"
          className="btn btn-danger  float-right"
          onClick={notificationDismissHandler}
        >
          dismiss
        </button>
      )}
    </div>
  );
}

export default Notification;
