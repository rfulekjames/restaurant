
import { createUser, signIn } from "../auth.js";
import { ReservationRepo } from "../repo.js";

export class UserService {

  static async createUser(email, password) {
    return await createUser(
      email,
      password,
    );
  }

  static async signIn(email, password) {
    return await signIn(email, password);
  }

  static async createUsername(userId, username) {
    await ReservationRepo.createUsername(userId, username);
  }

  static async getUsername(userId) {
    return await ReservationRepo.getUsername(userId);
  }
}
