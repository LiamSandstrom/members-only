import { UserDto } from "./userDto.js";

export interface MessageDto {
    id: number,
    user: UserDto,
    title: string,
    text: string,
    created_at: string,
}
