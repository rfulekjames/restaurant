import { useSelector } from "react-redux";
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getTables } from "../../store/tables-actions";
import { authActions } from "../../store/auth-slice";
import { showErrorNotification } from "../../utils/notifications";
import { LAYOUT_EDITOR_PATH } from "../Layout/Navigation";

function RestaurantNameForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const restaurantNameInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    if (restaurantNameInputRef.current.value.length) {
      const enteredRestaurantName = restaurantNameInputRef.current.value;
      dispatch(authActions.setRestaurant(enteredRestaurantName));
      dispatch(getTables(enteredRestaurantName));
      history.push(LAYOUT_EDITOR_PATH);
    } else {
      showErrorNotification(dispatch, "Restaurant Name Cannot be Empty!");
    }
  };

  return (
    <form onSubmit={submitHandler} className="form-signin">
      <div className="from-group">
        <input
          ref={restaurantNameInputRef}
          id="restaurantNameInput"
          placeholder="Restaurant Name"
          min="2"
          max="100"
          name="restaurant"
          className="form-control"
          autoFocus
        ></input>
      </div>
      <div className="table-responsive">
        <table className="table">
          <tbody>
            <tr>
              <td className="align-center">
                <button className="btn btn-success btn-block align-center" id="enterButton">
                  Enter
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  );
}

export default RestaurantNameForm;
