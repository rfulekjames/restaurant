import {
  createUser,
  authenticateUser,
  logout,
  authenticateUserWithCustomToken,
} from "../utils/server";

export const registerUserAndLogin = (userToRegister, history) => {
  return async (dispatch) => {
    await createUser(userToRegister, history, dispatch);
  };
};

export const loginUser = (userToRegister) => {
  return async (dispatch) => {
    await authenticateUser(userToRegister, dispatch);
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    await logout(dispatch);
  };
};
