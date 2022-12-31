import ReservationReportingForm from "../components/Reservations/ReservationsReportingForm";
import { useRedirect } from "../hooks/use-redirect";
import { useNoTableRedirect } from "../hooks/use-notableredirect";

function ReservationReportingPage() {
  const [restaurantName, uid] = useRedirect();
  const [tables, history] = useNoTableRedirect();

  return (
    <div className="container">
      <h3 className="text-center">
        {restaurantName} Reservations on a Given Date
      </h3>
      <ReservationReportingForm
        userId={uid}
        tables={tables}
        restaurantName={restaurantName}
      ></ReservationReportingForm>
    </div>
  );
}

export default ReservationReportingPage;
