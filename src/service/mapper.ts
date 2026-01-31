import { DbUser } from "../models/dbUser.js";
import { UserDto } from "../models/userDto.js";

function dbToUserDto(dbUser: DbUser): UserDto {
    const { password, ...dto } = dbUser;
    return dto;
}

export { dbToUserDto }
