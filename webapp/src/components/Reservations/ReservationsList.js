import { uiActions } from "../../store/ui-slice";
import { confirmAction } from "../../utils/window-methods";
import { useDispatch } from "react-redux";
import { removeReservation } from "../../store/reservations-actions";
import {
  FetchedReservationsTypeEnum,
  formatAMPM,
  formatUSDate,
  getNowString,
  getToday,
} from "../../utils/helper";

function ReservationsList(props) {
  const dispatch = useDispatch();
  const reservations = props.reservations;
  const now = getNowString();
  const today = getToday();

  const updateHandler = (event, reservation) => {
    event.preventDefault();
    dispatch(uiActions.setReservationToEdit(reservation));
    props.onUpdateButtonClick();
  };

  const deleteHandler = (event, reservation) => {
    event.preventDefault();
    confirmAction(
      "Are you sure you want to delete reservation #" + reservation.id + " ?",
      () => {
        deleteteReservation(reservation);
        dismissReservationToEditIfDeleted(reservation);
      }
    );
  };

  const dismissReservationToEditIfDeleted = (reservation) => {
    if (
      props.reservationToEdit &&
      reservation.id === props.reservationToEdit.id
    ) {
      dispatch(uiActions.dismissReservationToEdit());
    }
  };

  const deleteteReservation = (reservation) => {
    const reservationData = {
      ...reservation,
      uid: props.userId,
      tableId: props.tableId,
      restaurantName: props.restaurantName,
    };
    dispatch(removeReservation(reservationData));
  };

  const isFutureReservation = (reservation) => {
    return (
      (reservation.time >= now && reservation.date === today) ||
      reservation.date > today
    );
  };

  if (
    reservations.filter((reservation) =>
      +props.reservationsType === FetchedReservationsTypeEnum.FUTURE
        ? isFutureReservation(reservation)
        : !isFutureReservation(reservation)
    ).length === 0
  ) {
    return (
      <div className="container">
        <br />
        <b>
          No{" "}
          {+props.reservationsType === FetchedReservationsTypeEnum.FUTURE
            ? " Future "
            : " Past "}
          Reservations found!
        </b>
      </div>
    );
  }

  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          <th>{"Id"}</th>
          <th>{"Date"}</th>
          <th>{"Time"}</th>
          <th>{"Customer Name"}</th>
          <th>{"Customer Contact Details"}</th>
          <th colSpan="2">{"Actions"}</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((reservation) => {
          if (
            +props.reservationsType === FetchedReservationsTypeEnum.FUTURE &&
            !isFutureReservation(reservation)
          ) {
            return null;
          }
          if (
            +props.reservationsType === FetchedReservationsTypeEnum.PAST &&
            isFutureReservation(reservation)
          ) {
            return null;
          }
          return (
            <tr key={reservation.id}>
              <td>{reservation.id}</td>
              <td>
                <b>{formatUSDate(reservation.date)}</b>
              </td>
              <td>
                <b>{formatAMPM(reservation.time)}</b>
              </td>
              <td>{reservation.customerName}</td>
              <td>{reservation.contactDetails}</td>
              <td>
                <button
                  className="btn btn-info btn-block"
                  onClick={(event) => updateHandler(event, reservation)}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger  btn-block "
                  onClick={(event) => deleteHandler(event, reservation)}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ReservationsList;
