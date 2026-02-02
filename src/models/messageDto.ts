import { UserDto } from "./userDto.js";

export interface MessageDto {
    user: UserDto,
    title: string,
    text: string,
    created_at: string,
}
