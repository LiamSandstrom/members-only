import { UserDto } from "../src/models/user.ts";

declare global {
    namespace Express {
        interface User extends UserDto { }
    }
}

export { };
