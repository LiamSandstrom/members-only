import { DbUser } from "../models/dbUser.js";
import { UserDto } from "../models/userDto.js";

const dbToUserDto = (dbUser: DbUser): UserDto => {
    const { password, ...dto } = dbUser;
    return dto;
}

export { dbToUserDto }
