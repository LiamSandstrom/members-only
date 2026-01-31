import { DbUser } from "../models/dbUser.js";
import { db } from "./db.js"


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

export { getAllUsers, getUserFromId, getUserFromUsername }
