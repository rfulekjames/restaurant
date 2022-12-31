export function getToday() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  return yyyy + "-" + mm + "-" + dd;
}

export function getNow() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function formatAMPM(time) {
  var hours = time.substring(0, 2);
  var minutes = time.substring(3);
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export function formatUSDate(date) {
  const year = date.substring(0, 4);
  const month = date.substring(5, 7);
  const day = date.substring(8);

  const strTime = month + "/" + day + "/" + year;
  return strTime;
}


export const reservationsReducer = (acc, reservation) => {
  if (acc.length && reservation.tableId === acc[acc.length - 1][0].tableId) {
    acc[acc.length - 1].push(reservation);
  } else {
    acc.push([reservation]);
  }
  return acc;
};

export const FetchedReservationsTypeEnum = { FUTURE: 1, PAST: 2 };
Object.freeze(FetchedReservationsTypeEnum);
