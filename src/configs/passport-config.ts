import bcrypt from "bcryptjs";
import { getUserFromId, getUserFromUsername } from "../db/queries.js"
import { VerifyFunction } from "passport-local"
import { Strategy } from "passport-local";
import passport from "passport";
import { dbToUserDto } from "../service/mapper.js";

const verifyCallback: VerifyFunction = async (username, password, done) => {
    try {
        const dbUser = await getUserFromUsername(username);

        if (!dbUser) {
            return done(null, false, { message: "Invalid login" });
        }

        const isValid = await validatePassword(password, dbUser.password)

        if (!isValid) {
            return done(null, false, { message: "Invalid login" });
        }

        const user = dbToUserDto(dbUser);
        return done(null, user);
    }
    catch (err) {
        done(err)
    }
}

const validatePassword = async (input: string, password: string) => {
    return await bcrypt.compare(input, password);
}

const strategy = new Strategy(verifyCallback)

passport.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (userId: number, done) => {
    try {
        const dbUser = await getUserFromId(userId)
        const user = dbToUserDto(dbUser);
        done(null, user)
    }
    catch (err) {
        done(err)
    }
})
