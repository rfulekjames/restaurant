import { uiActions } from "../store/ui-slice";

const SHOW_TECHNICAL_ERROR = true;

var finished = true;

export function showNotification(
  dispatch,
  notificationType,
  notificationTitle,
  notificationMessage
) {
  dispatch(
    uiActions.showNotification({
      status: notificationType,
      title: notificationTitle,
      message: notificationMessage,
    })
  );
}

export function showSuccessNotification(dispatch, notificationMessage) {
  finished = true;
  showNotification(dispatch, "success", "Success!", notificationMessage);
}

export function showErrorNotification(dispatch, notificationMessage) {
  finished = true;
  showNotification(dispatch, "danger", "Error!", notificationMessage);
}

export function showPendingNotification(dispatch, notificationMessage) {
  finished = false;
  setTimeout(() => {
    if (finished === false) {
      showNotification(dispatch, "warning", "Pending...", notificationMessage);
    }
  }, 1000);
}

export function errorMessage(userFriendlyMessage, technicalErrorMessage) {
  return (
    userFriendlyMessage +
    (SHOW_TECHNICAL_ERROR ? " " + technicalErrorMessage : "")
  );
}
