import AuthForm from "../components/Auth/AuthForm";
import RestaurantNameForm from "../components/Auth/RestaurantNameForm";
import AuthFormWrapper from "../components/Layout/AuthFormWrapper";
import { useSelector } from "react-redux";

function StartingPage(props) {
  const isLoggedIn =
    useSelector((state) => state.auth.isLoggedIn) || props.autoLogin;

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
