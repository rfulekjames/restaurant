import { useRef } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initUserAndShowNextPage } from "../../store/auth-actions";
import { showErrorNotification } from "../../utils/notifications";
export const MIN_PASSWORD_LENGTH = 7;
export const MIN_USERNAME_LENGTH = 2;
export const MAX_INPUT_LENGTH = 50;

function RegistrationForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfirmInputRef = useRef();
  const usernameInputRef = useRef();

  const cancelHandler = (event) => {
    event.preventDefault();
    history.push("/");
  };

  const registrationHandler = (event) => {
    event.preventDefault();

    const enteredPassword = passwordInputRef.current.value;
    const enteredPasswordConfirm = passwordConfirmInputRef.current.value;
    if (enteredPassword !== enteredPasswordConfirm) {
      showErrorNotification(
        dispatch,
        "The password and its confirmation differ!"
      );
      return;
    }
    const enteredName = usernameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;

    const newUser = {
      email: enteredEmail,
      password: enteredPassword,
      username: enteredName,
    };
    dispatch(initUserAndShowNextPage(newUser, history));
  };
  return (
    <form className="form-signin" onSubmit={registrationHandler}>
      <div className="from-group">
        {/* <label>Username:</label> */}
        <input
          ref={usernameInputRef}
          type="text"
          placeholder="Username"
          name="name"
          className="form-control"
          minLength={MIN_USERNAME_LENGTH}
          maxLength={MAX_INPUT_LENGTH}
          required
          autoFocus
        ></input>
      </div>
      <br />
      <div className="from-group">
        {/* <label>Email:</label> */}
        <input
          ref={emailInputRef}
          type="email"
          placeholder="Email Address"
          name="emailAddress"
          className="form-control"
          maxLength={MAX_INPUT_LENGTH}
          required
        ></input>
      </div>
      <br />
      <div className="from-group">
        {/* <label>Password:</label> */}
        <input
          ref={passwordInputRef}
          className="form-control"
          placeholder="Password"
          minLength={MIN_PASSWORD_LENGTH}
          maxLength={MAX_INPUT_LENGTH}
          type="password"
          required
        />
      </div>
      <br />
      <div className="from-group">
        {/* <label>Confirm Password:</label> */}
        <input
          ref={passwordConfirmInputRef}
          className="form-control"
          placeholder="Confirm Password"
          minLength={MIN_PASSWORD_LENGTH}
          maxLength={MAX_INPUT_LENGTH}
          type="password"
          required
        />
      </div>
      <br />
      <div className="table-responsive">
        <table className="table">
          <tbody>
            <tr>
              <td className="align-left">
                <button
                  className="btn btn-danger btn-block align-left"
                  onClick={cancelHandler}
                >
                  Cancel
                </button>
              </td>
              <td className="align-right">
                <button
                  formAction="submit"
                  className="btn btn-success btn-block align-right"
                >
                  Register
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  );
}

export default RegistrationForm;
