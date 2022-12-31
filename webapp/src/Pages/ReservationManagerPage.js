import ReservationsEditor from "../components/Reservations/ReservationsEditor";
import TableGrid from "../components//Tables/TableGrid";
import { Fragment } from "react";
import { Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RESERVATION_MANAGEMENT_PATH } from "../components/Layout/Navigation";
import { getReservations } from "../store/reservations-actions";
import { reservationsActions } from "../store/reservations-slice";
import { FetchedReservationsTypeEnum } from "../utils/helper";
import { useRedirect } from "../hooks/use-redirect";
import { useNoTableRedirect } from "../hooks/use-notableredirect";

function TablesReservationManagerPage() {
  const [restaurantName, uid] = useRedirect();
  const [tables, history] = useNoTableRedirect();
  const dispatch = useDispatch();

  const listTypeChangeHandler = () => {
    dispatch(reservationsActions.flipReservationsOrder());
  };

  const showTableReservationsHandler = (cellData) => {
    if (cellData.tableId) {
      dispatch(
        getReservations(
          restaurantName,
          cellData.tableId,
          FetchedReservationsTypeEnum.FUTURE
        )
      );
      history.push(RESERVATION_MANAGEMENT_PATH + "/" + cellData.tableId);
    }
  };

  return (
    <Fragment>
      <Route path={RESERVATION_MANAGEMENT_PATH} exact>
        <TableGrid
          restaurantName={restaurantName}
          gridInfo={"Reservations for"}
          onTableClick={showTableReservationsHandler}
        />
      </Route>
      <Route path={RESERVATION_MANAGEMENT_PATH + "/:tableId"}>
        <ReservationsEditor
          onListTypeChange={listTypeChangeHandler}
          restaurantName={restaurantName}
        />
      </Route>
    </Fragment>
  );
}

export default TablesReservationManagerPage;
