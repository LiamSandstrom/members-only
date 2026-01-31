import { UserDto } from "../src/models/userDto.ts";

declare global {
    namespace Express {
        interface User extends UserDto { }
    }
}

export { };
