import bcrypt from "bcryptjs";
import { CreateUserInput } from "../models/createUserInput.js";
import { DbUser } from "../models/dbUser.js";
import { db } from "./db.js"
import { UserDto } from "../models/userDto.js";


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
        "INSERT INTO users (firstname, lastname, username, password, admin) VALUES ($1, $2, $3, $4, $5) RETURNING id, firstname, lastname, username, admin",
        [user.firstname, user.lastname, user.username, hashedPassword, user.admin]
    );
    return result.rows[0];
};

export { getAllUsers, getUserFromId, getUserFromUsername, createUser }
