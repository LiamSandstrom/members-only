import { UserDto } from "./userDto.js";

export interface Message {
    user: UserDto,
    title: string,
    text: string,
    created_at: string,
}
