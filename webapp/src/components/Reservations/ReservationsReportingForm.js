import { getToday } from "../../utils/helper";
import { useRef, useState, useEffect } from "react";
import { Fragment } from "react";
import SimpleReservationsList from "./SimpleReservationsList";
import { useDispatch, useSelector } from "react-redux";
import { getAllReservationsForDate } from "../../store/reservations-actions";
import { reservationsActions } from "../../store/reservations-slice";

function ReservationReportingForm(props) {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const dateInputRef = useRef();
  const dispatch = useDispatch();

  let reservationsReporting = useSelector(
    (state) => state.reservations.reservationReporting
  );

  const changeDateHandler = (event) => {
    event.preventDefault();
    setSelectedDate(dateInputRef.current.value);
    setReservatationsForDate();
  };

  const refreshHandler = (event) => {
    event.preventDefault();
    setReservatationsForDate();
  };

  const setReservatationsForDate = () => {
    dispatch(reservationsActions.removeReservationsReporting());

    dispatch(
      getAllReservationsForDate(
        props.restaurantName,
        dateInputRef.current.value
      )
    );
  };

  useEffect(() => {
    setReservatationsForDate();
  }, []);

  return (
    <Fragment>
      <form className="form-inline">
        <table>
          <tbody>
            <tr>
              <td>
                <b>Choose Date:</b>
              </td>
            </tr>
            <tr>
              <td>
                <input
                  id="dateInput"
                  ref={dateInputRef}
                  value={selectedDate}
                  onChange={changeDateHandler}
                  type="date"
                  className="form-control input-sm"
                  required
                ></input>
              </td>
              <td>
                <button
                  className="form-control btn btn-success input-sm"
                  onClick={refreshHandler}
                >
                  Refresh
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <br />
      {reservationsReporting && reservationsReporting.length === 0 && (
        <b>No reservations for the date.</b>
      )}

      {reservationsReporting &&
        reservationsReporting.length > 0 &&
        reservationsReporting.map((tableReservations) => {
          return (
            <SimpleReservationsList
              reservations={tableReservations}
              key={tableReservations[0].tableId}
            />
          );
        })}
    </Fragment>
  );
}

export default ReservationReportingForm;
