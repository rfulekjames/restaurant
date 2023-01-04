import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setReservationAndUpdateReservations } from "../../store/reservations-actions";
import { uiActions } from "../../store/ui-slice";
import { useRef } from "react";
import { RESERVATION_MANAGEMENT_PATH } from "../Layout/Navigation";
import { useHistory } from "react-router-dom";
import { extractHoursFromTimeString, extractAmPmFromTimeString, getTimeStringFromAmPmHours, getToday, getNowString, getHoursString } from "../../utils/helper";
import { showErrorNotification } from "../../utils/notifications";

const DEFAULT_DATA = {
  date: getToday(),
  time: getNowString(),
  customerName: "",
  contactDetails: "",
};

function ReservationForm(props) {
  const [enteredData, updateEnteredData] = useState(DEFAULT_DATA);
  const history = useHistory();
  const dispatch = useDispatch();
  const dateInputRef = useRef();
  const hoursInputRef = useRef();
  const amPmInputRef = useRef();
  const customerNameInputRef = useRef();
  const contactDetailsInputRef = useRef();
  const newReservationId = useSelector(
    (state) => state.reservations.newReservationId
  );
  const reservationToEdit = useSelector((state) => state.ui.reservationToEdit);


  const restaurantName = props.restaurantName;

  const getShownReservationData = () => {
    let shownData = null;
    if (reservationToEdit) {
      shownData = reservationToEdit;
    } else if (enteredData) {
      shownData = enteredData;
    } else {
      updateEnteredData(DEFAULT_DATA);
    }
    return shownData;
  };

  const getEnteredReservationData = () => {
    const enteredReservationData = {
      date: dateInputRef.current.value,
      time: getTimeStringFromAmPmHours(hoursInputRef.current.value, amPmInputRef.current.value),
      contactDetails: contactDetailsInputRef.current.value,
      customerName: customerNameInputRef.current.value,
      id: reservationToEdit ? reservationToEdit.id : newReservationId,
      tableId: props.tableId,
      restaurantName: restaurantName,
    };
    return enteredReservationData;
  };

  const shownData = getShownReservationData();

  const changeHandler = (event) => {
    //event.preventDefault();
    const trimmedTime =
      getTimeStringFromAmPmHours(hoursInputRef.current.value, amPmInputRef.current.value);
    updateEnteredData({
      date: dateInputRef.current.value,
      time: trimmedTime,
      customerName: customerNameInputRef.current.value,
      contactDetails: contactDetailsInputRef.current.value,
    });
    if (reservationToEdit) {
      dispatch(
        uiActions.setReservationToEdit({
          id: reservationToEdit.id,
          date: dateInputRef.current.value,
          time: trimmedTime,
          customerName: customerNameInputRef.current.value,
          contactDetails: contactDetailsInputRef.current.value,
        })
      );
    }
  };

  const addReservationhandler = (event) => {
    event.preventDefault();
    const enteredReservationData = getEnteredReservationData();
    if (validateReservation(enteredReservationData)) {
      dispatch(
        setReservationAndUpdateReservations(enteredReservationData, props.type)
      );
      dispatch(uiActions.dismissReservationToEdit());
      updateEnteredData(DEFAULT_DATA);
    } else {
      showErrorNotification(
        dispatch,
        "The table is already reserved at the given time!"
      );
    }
  };

  const closeHandler = (event) => {
    event.preventDefault();
    dispatch(uiActions.dismissReservationToEdit());
    history.push(RESERVATION_MANAGEMENT_PATH);
  };

  const cancelHandler = (event) => {
    event.preventDefault();
    dispatch(uiActions.dismissReservationToEdit());
  };

  const validateReservation = (reservation) => {
    for (const oldReservation of props.reservations) {
      if (
        reservation.id !== oldReservation.id &&
        oldReservation.date === reservation.date &&
        oldReservation.time === reservation.time
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <form className="form-signin" onSubmit={addReservationhandler}>
      <div className="from-group">
        <table className="table">
          <tbody>
            <tr>
              <td>
                Date:
                <input
                  ref={dateInputRef}
                  value={shownData.date}
                  onChange={changeHandler}
                  inputMode="text"
                  type="date"
                  className="form-control"
                  required
                ></input>{" "}
              </td>
              <td>
                Time:
                <select  className="form-control" ref={hoursInputRef} name="cars" id="hours" value={extractHoursFromTimeString(shownData.time)} onChange={changeHandler}>
                  {[...Array(12).keys()].map((hour) => (<option value={getHoursString(hour + 1)}>{getHoursString(hour + 1)}:00</option>))}
                </select>
                </td>
                <td>
                &nbsp;
                <select  className="form-control" ref={amPmInputRef} name="amPm" id="amPm" value={extractAmPmFromTimeString(shownData.time)} onChange={changeHandler}>
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </td>
              <td>
                Customer Name:
                <input
                  ref={customerNameInputRef}
                  value={shownData.customerName}
                  onChange={changeHandler}
                  inputMode="text"
                  type="text"
                  className="form-control"
                  minLength="3"
                  maxLength="50"
                  required
                  autoFocus
                ></input>
              </td>
            </tr>
            <tr>
              <td colSpan="4">
                Contact Details:
                <input
                  ref={contactDetailsInputRef}
                  value={shownData.contactDetails}
                  onChange={changeHandler}
                  inputMode="text"
                  type="text"
                  className="form-control"
                  minLength="3"
                  maxLength="200"
                  required
                ></input>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <br />
      <div className="table-responsive">
        <table className="table">
          <tbody>
            <tr>
              <td className="align-left">
                <button
                  onClick={closeHandler}
                  className="btn btn-danger btn-block align-left"
                >
                  Close
                </button>
              </td>
              {reservationToEdit && (
                <td className="align-left">
                  <button
                    onClick={cancelHandler}
                    className="btn btn-warning btn-block align-left"
                  >
                    Cancel Update
                  </button>
                </td>
              )}
              <td className="align-right">
                <button
                  formAction="submit"
                  className="btn btn-success btn-block align-right"
                >
                  {reservationToEdit ? "Update " : "Add "} Reservation
                  {reservationToEdit ? " #" + reservationToEdit.id : ""}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  );
}

export default ReservationForm;
