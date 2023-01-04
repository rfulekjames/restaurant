export function getToday() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();
  return yyyy + "-" + mm + "-" + dd;
}

export function getNowString() {
  const now = new Date();
  const hours = getHoursString(now.getHours());
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getHoursString(hours) {
  return String(hours).padStart(2, "0");
}

export function extractHoursFromTimeString(timeString) {
  let hours = parseInt(timeString.substring(0, 2));
  hours = hours % 12;
  hours = hours ? hours : 12;
  return getHoursString(hours);
}

export function getHoursFromAmPmHours(amPmHoursString, amPm) {
  let hours = parseInt(amPmHoursString);
  hours = hours % 12;
  if (amPm.toLowerCase() === 'pm') {
    hours = hours + 12;
  }
  return getHoursString(hours);
}

export function getTimeStringFromAmPmHours(amPmHoursString, amPm) {
  return `${getHoursFromAmPmHours(amPmHoursString, amPm)}:00`;
}


export function extractAmPmFromTimeString(timeString) {
  return parseInt(timeString.substring(0, 2)) >= 12 ? "PM" : "AM";
}

export function formatAMPM(timeString) {
  var minutes = timeString.substring(3);
  return `${extractHoursFromTimeString(timeString)}:${minutes} ${extractAmPmFromTimeString(timeString)}`;
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
