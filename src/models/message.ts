import { User } from "./user.js";

export interface Message {
    user: User,
    title: string,
    text: string,
    created_at: string,
}
