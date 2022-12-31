import { formatAMPM } from "../../utils/helper";
import { Fragment } from "react";

function SimpleReservationsList(props) {
  const reservations = props.reservations;
  let tableId = null;
  if (reservations[0]) {
    tableId = reservations[0].tableId;
  }
  return (
    <Fragment>
      <div className="container">
        <b>Table #{tableId}</b>
      </div>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>{"Id"}</th>
            <th>{"Time"}</th>
            <th>{"Customer Name"}</th>
            <th>{"Customer Contact Details"}</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => {
            return (
              <tr key={reservation.id + tableId}>
                <td>{reservation.id}</td>
                <td>
                  <b>{formatAMPM(reservation.time)}</b>
                </td>
                <td>{reservation.customerName}</td>
                <td>{reservation.contactDetails}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />
    </Fragment>
  );
}

export default SimpleReservationsList;
