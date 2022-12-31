export function DefaultRedirect(uid, restaurantName, history) {
    if (!(restaurantName && uid)) {
        history.push("/");
      }
    
}