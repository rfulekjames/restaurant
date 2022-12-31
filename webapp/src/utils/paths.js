export function getFirestorePathForTables(uid, restaurantName) {
  return uid + "/" + restaurantName + "/tables";
}

export function getFirestorePathForReservations(uid, restaurantName) {
  return uid + "/" + restaurantName + "/reservations";
}
