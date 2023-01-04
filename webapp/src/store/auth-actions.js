import {
  createUser,
  initUser,
  authenticateUser,
  logout,
} from "../utils/server";

export const registerUserAndLogin = (userToRegister, history) => {
  return async (dispatch) => {
    await createUser(userToRegister, history, dispatch);
  };
};

export const initUserAndShowNextPage = (userToInit, history) => {
  return async (dispatch) => {
    await initUser(userToInit, history, dispatch);
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
