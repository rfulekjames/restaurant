import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { logoutUser } from "../../store/auth-actions";
import { Fragment } from "react";
import { useDispatch } from "react-redux";

import ActivatedLiLink from "../UI/ActivatedLiLink";

export const LAYOUT_EDITOR_PATH = "/layouteditor";
export const HOME_PATH = "/";
export const RESERVATION_MANAGEMENT_PATH = "/reservationmanager";
export const RESERVATION_REPORTING_PATH = "/reservationreporting";
export const AUTO_LOGIN_PATH = "/auto";

function Navigation() {
  const history = useHistory();
  const dispatch = useDispatch();
  const restaurantName = useSelector((state) => state.auth.restaurantName);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userName = useSelector((state) => state.auth.userName);

  const logoutHandler = (event) => {
    event.preventDefault();
    dispatch(logoutUser());
    history.push("/");
  };

  return (
    <Fragment>
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <Link className="navbar-brand" to="/" id="restaurantNameAnchor">
          {restaurantName} Restaurant Reservation
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <ActivatedLiLink path={HOME_PATH} title="Home" />
            {restaurantName != null && (
              <Fragment>
                <ActivatedLiLink
                  path={LAYOUT_EDITOR_PATH}
                  title="Table Layout Editor"
                />
                <ActivatedLiLink
                  id={"reservationManagerAnchor"}
                  path={RESERVATION_MANAGEMENT_PATH}
                  title="Reservation Manager"
                  accordingToRoot={true}
                />
                <ActivatedLiLink
                  id={"reservationReportingAnchor"}
                  path={RESERVATION_REPORTING_PATH}
                  title="Reservation Reporting"
                />
              </Fragment>
            )}
          </ul>
          {isLoggedIn && (
            <Fragment>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/" id="usernameAnchor">
                    {userName}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={logoutHandler}>
                    Logout
                  </Link>
                </li>{" "}
              </ul>
            </Fragment>
          )}
        </div>
      </nav>
      <br />
    </Fragment>
  );
}

export default Navigation;
