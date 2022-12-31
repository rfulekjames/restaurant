import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAccessTokenFromSessionStorage } from "../utils/window-methods";
import { useDispatch } from "react-redux";

export function useRedirect() {
  const restaurantName = useSelector((state) => state.auth.restaurantName);
  const uid = useSelector((state) => state.auth.uid);
  const history = useHistory();
  const dispatch = useDispatch();

  if (!uid) {
    const accessToken = getAccessTokenFromSessionStorage();
    if (accessToken) {
      history.push("/");
    }
  } else if (!restaurantName) {
    history.push("/");
  }

  return [restaurantName, uid];
}
