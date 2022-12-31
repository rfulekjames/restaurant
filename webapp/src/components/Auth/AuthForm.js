import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/auth-actions";
import { useRef } from "react";
import { MAX_INPUT_LENGTH } from "./RegistrationForm";
import { MIN_PASSWORD_LENGTH } from "./RegistrationForm";

function AuthForm() {
  const dispatch = useDispatch();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const loginHandler = (event) => {
    const enteredPassword = passwordInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    event.preventDefault();
    dispatch(loginUser({ email: enteredEmail, password: enteredPassword }));
  };

  return (
    <form className="form-signin" onSubmit={loginHandler}>
      <div className="from-group">
        <input
          ref={emailInputRef}
          placeholder="Email Address"
          name="firstName"
          className="form-control"
          type="email"
          maxLength={MAX_INPUT_LENGTH}
          autoFocus
        ></input>
      </div>
      <br />
      <div className="from-group">
        <input
          ref={passwordInputRef}
          className="form-control"
          placeholder="Password"
          type="password"
          minLength={MIN_PASSWORD_LENGTH}
          maxLength={MAX_INPUT_LENGTH}
          required
        />
      </div>
      <br />
      <div className="table-responsive">
        <table className="table">
          <tbody>
            <tr>
              <td>
                <div className="checkbox mb-3">
                  <h6>Do not have an account?</h6>
                  <Link to="/registration">Register</Link> &nbsp;
                </div>
              </td>
              <td className="align-right">
                <button
                  formAction="submit"
                  className="btn btn-success btn-block align-right"
                >
                  Login
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  );
}

export default AuthForm;
