import bcrypt from "bcryptjs";
import { CreateUserInput } from "../models/createUserInput.js";
import { DbUser } from "../models/dbUser.js";
import { db } from "./db.js"
import { UserDto } from "../models/userDto.js";
import { DbMessage } from "../models/dbMessage.js";
import { CreateMessageInput } from "../models/createMessageInput.js";
import { MessageDto } from "../models/messageDto.js";


const getAllUsers = async (): Promise<DbUser[]> => {

    const { rows } = await db.query("SELECT * FROM users");
    return rows;
}

const getUserFromId = async (id: number): Promise<DbUser> => {
    const { rows } = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    return rows[0];
}
const getUserFromUsername = async (username: string): Promise<DbUser> => {
    const { rows } = await db.query("SELECT * FROM users WHERE username= $1", [username]);
    return rows[0];
}

const createUser = async (user: CreateUserInput): Promise<UserDto> => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const result = await db.query(
        "INSERT INTO users (firstname, lastname, username, password, member, admin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, firstname, lastname, username,member, admin",
        [user.firstname, user.lastname, user.username, hashedPassword, user.member, user.admin]
    );
    return result.rows[0];
};

const createMessage = async (message: CreateMessageInput) => {
    const result = await db.query(
        "INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3) RETURNING id, title, text, user_id, created_at",
        [message.title, message.text, message.user_id]
    );
    return result.rows[0];
}

const getAllMessages = async (): Promise<DbMessage[]> => {
    const { rows } = await db.query("SELECT * from messages");
    return rows;
}
const getAllMessagesWithUsers = async (): Promise<MessageDto[]> => {
    const result = await db.query(`
        SELECT 
            m.id,
            m.title,
            m.text,
            m.created_at,
            u.id as user_id,
            u.firstname as user_firstname,
            u.lastname as user_lastname,
            u.username as user_username,
            u.member as user_member,
            u.admin as user_admin
        FROM messages m
        JOIN users u ON m.user_id = u.id
        ORDER BY m.created_at DESC
    `);

    return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        text: row.text,
        created_at: row.created_at,
        user: {
            id: row.user_id,
            firstname: row.user_firstname,
            lastname: row.user_lastname,
            username: row.user_username,
            member: row.user_member,
            admin: row.user_admin
        }
    }));
}

const getMessageFromId = async (id: number) => {
    const { rows } = await db.query("SELECT * FROM messages WHERE id = $1", [id]);
    return rows[0];
}

const updateUserAccount = async (id: number, isMember: boolean, isAdmin: boolean) => {
    await db.query("UPDATE users SET member = $1, admin = $2 WHERE id = $3", [isMember, isAdmin, id]);
}

const deleteMessageWithId = async (id: number) => {
    await db.query("DELETE from messages WHERE id = $1", [id])
}

export { getAllUsers, getUserFromId, getUserFromUsername, createUser, createMessage, getAllMessages, getAllMessagesWithUsers, getMessageFromId, updateUserAccount, deleteMessageWithId }
