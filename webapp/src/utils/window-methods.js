export function scrollToRef(ref) {
  window.scrollTo(0, ref.current.offsetTop);
}

export function confirmAction(confirmationText, action) {
  if (window.confirm(confirmationText)) {
    action();
  }
}

export function warning(message) {
  alert(message);
}

export function noTablesWarningAndRedirect(redirect, history) {
  warning("There are no tables yet, let alone reservation(s)!");
  history.push(redirect);
}

export function setAccessTokenInSessionStorage(accessToken) {
  window.sessionStorage.setItem("accessToken", accessToken);
}

export function getAccessTokenFromSessionStorage() {
  return window.sessionStorage.getItem("accessToken");
}
