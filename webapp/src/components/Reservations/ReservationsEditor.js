import { Fragment } from "react";
import ReservationsList from "./ReservationsList";
import ReservationForm from "./ReservationForm";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { FetchedReservationsTypeEnum } from "../../utils/helper";
import { useState } from "react";
import { scrollToRef } from "../../utils/window-methods";

function ReservationsEditor(props) {
  const { tableId } = useParams();
  const formh2Ref = useRef();
  const reservationToEdit = useSelector((state) => state.ui.reservationToEdit);
  const [futurePast, setFuturePast] = useState(
    FetchedReservationsTypeEnum.FUTURE
  );
  const reservations = useSelector(
    (state) => state.reservations.tableReservations
  );

  const scrollToForm = () => scrollToRef(formh2Ref);

  const selectListTypeHandler = (event) => {
    if (event.target.checked) {
      setFuturePast(+event.target.value);
      props.onListTypeChange();
    }
  };

  return (
    <Fragment>
      <h2 ref={formh2Ref} className="text-center">
        Reservations For Table #{tableId}
      </h2>
      <div className="container">
        <ReservationForm
          type={futurePast}
          reservationToEdit={reservationToEdit}
          userId={props.userId}
          restaurantName={props.restaurantName}
          tableId={tableId}
          reservations={reservations}
        ></ReservationForm>
      </div>
      <div className="container">
        <fieldset id="group1">
          <input
            id="futureReservationsRadio"
            type="radio"
            value={FetchedReservationsTypeEnum.FUTURE}
            name="group1"
            checked={FetchedReservationsTypeEnum.FUTURE === futurePast}
            onChange={selectListTypeHandler}
          />
          Future Reservations &nbsp; &nbsp; &nbsp;
          <input
            id="pastReservationsRadio"
            type="radio"
            value={FetchedReservationsTypeEnum.PAST}
            name="group1"
            checked={FetchedReservationsTypeEnum.PAST === futurePast}
            onChange={selectListTypeHandler}
          />
          Past Reservations
        </fieldset>
        <ReservationsList
          reservationsType={futurePast}
          reservations={reservations}
          tableId={tableId}
          userId={props.userId}
          restaurantName={props.restaurantName}
          onUpdateButtonClick={scrollToForm}
          reservationToEdit={reservationToEdit}
        ></ReservationsList>
      </div>
    </Fragment>
  );
}

export default ReservationsEditor;
