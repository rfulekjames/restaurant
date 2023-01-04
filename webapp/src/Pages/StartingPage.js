import AuthForm from "../components/Auth/AuthForm";
import RestaurantNameForm from "../components/Auth/RestaurantNameForm";
import AuthFormWrapper from "../components/Layout/AuthFormWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "../hooks/use-query";
import { useHistory, useLocation } from "react-router-dom";
import { registerUserAndLogin } from "../store/auth-actions";

function StartingPage(props) {
  const query = useQuery();
  const history = useHistory();
  const dispatch = useDispatch();  
  const { search } = useLocation();

  const username = query.get("username");
  if (username) {
    history.push("/");
    dispatch(registerUserAndLogin({
      username,
      email: query.get("email"),
      password: query.get("password"),
      key: new URLSearchParams(search).get('apiKey'),
    },
      history,
    ));
  }

  const isLoggedIn =
    useSelector((state) => state.auth.isLoggedIn) || props.autoLogin || username;

  return (
    <AuthFormWrapper
      title={
        (!isLoggedIn && "Login") || (isLoggedIn && "Enter Restaurant Name")
      }
    >
      {!isLoggedIn && <AuthForm />}
      {isLoggedIn && <RestaurantNameForm />}
    </AuthFormWrapper>
  );
}

export default StartingPage;
