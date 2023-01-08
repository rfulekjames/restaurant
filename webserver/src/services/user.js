
import { createUser, signIn } from "../auth.js";

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

}
