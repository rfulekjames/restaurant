import StartingPage from "./Pages/StartingPage";
import TablesLayoutEditorPage from "./Pages/TablesLayoutEditorPage";
import ReservationManagerPage from "./Pages/ReservationManagerPage";
import RegistrationPage from "./Pages/RegistrationPage";
import ReservationReportingPage from "./Pages/ReservationsReportingPage";
import Layout from "./components/Layout/Layout";
import { Switch, Route, Redirect } from "react-router-dom";
import Notification from "./components/UI/Notification";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { uiActions } from "./store/ui-slice";
import {
  LAYOUT_EDITOR_PATH,
  HOME_PATH,
  AUTO_LOGIN_PATH,
  RESERVATION_MANAGEMENT_PATH,
  RESERVATION_REPORTING_PATH,
} from "./components/Layout/Navigation";

//const SUCCESS_NOTIFICATION_TIMEOUT = 100;

function App() {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);

  if (notification && notification.status === "success") {
    dispatch(uiActions.dismissNotification());
  }
  const notificationDismissHandler = () => {
    dispatch(uiActions.dismissNotification());
  };

  return (
    <Layout>
      {notification && (
          <Notification
            notificationDismiss={notificationDismissHandler}
            status={notification.status}
            title={notification.title}
            message={notification.message}
          />
        ) && (
          <Notification
            notificationDismiss={notificationDismissHandler}
            status={notification.status}
            title={notification.title}
            message={notification.message}
          />
        )}
      <Switch>
        <Route path={HOME_PATH} exact>
          <StartingPage autoLogin={false} />
        </Route>
        <Route path={AUTO_LOGIN_PATH}>
          <StartingPage autoLogin={true} />
        </Route>
        <Route path="/registration">
          <RegistrationPage />
        </Route>
        <Route path={LAYOUT_EDITOR_PATH}>
          <TablesLayoutEditorPage />
        </Route>
        <Route path={RESERVATION_MANAGEMENT_PATH}>
          <ReservationManagerPage />
        </Route>
        <Route path={RESERVATION_REPORTING_PATH}>
          <ReservationReportingPage />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
