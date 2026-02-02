import { NextFunction, Request, Response } from "express"
import { CreateUserInput } from "../models/createUserInput.js"
import { validateMessageForm, validateSignupForm } from "../service/validation.js"
import { matchedData, validationResult } from "express-validator"
import { createMessage, createUser, getAllMessages, getAllMessagesWithUsers } from "../db/queries.js"
import passport, { AuthenticateCallback } from "passport"
import { DbMessage } from "../models/dbMessage.js"
import { CreateMessageInput } from "../models/createMessageInput.js"

const listAll = async (req: Request, res: Response) => {
    if (!req.user) {
        res.redirect("/log-in")
        return;
    }
    const messages = await getAllMessagesWithUsers();
    console.log(messages)
    res.render("index", { messages: messages })
}

const create = [...validateMessageForm, async (req: Request, res: Response) => {
    if (!req.user) {
        console.log("som1 PASSED validateMessageForm")
        res.send("u bad")
        return;
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("createMessage", {
            title: req.body.title,
            text: req.body.text,
            errors: errors.array(),
        });
    }

    const { title, text } = matchedData(req)

    const newMessage: CreateMessageInput = {
        user_id: req.user.id,
        title,
        text,
    }

    try {
        await createMessage(newMessage);
        return res.redirect("/")
    }
    catch (err) {
        console.error("Error creating message", err);
        return res.status(500).render("createMessage", {
            title: req.body.title,
            text: req.body.text,
            errors: [{ msg: "Server error posting message" }],
        });
    }
}]

const createView = (req: Request, res: Response) => {
    res.render("createMessage");
}

const signup = [...validateSignupForm, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("signup", {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            errors: errors.array(),
        });
    }

    const { firstname, lastname, username, password } = matchedData(req)
    const newUser: CreateUserInput = {
        firstname,
        lastname,
        username,
        password,
        member: false,
        admin: false
    }

    try {
        //hashing in createUser. prob bad but feels nicer for the scope of this proj as i can just call it now without thinking
        const createdUser = await createUser(newUser)

        //auto login
        req.login(createdUser, (err) => {
            if (err) return next(err)
            return res.redirect("/")
        })
    }
    catch (err) {
        console.error("Signup error:", err);
        return res.status(500).render("signup", {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            errors: [{ msg: "Server error creating account" }],
        });
    }

}]

const signupView = (req: Request, res: Response) => {
    res.render("signup")
}

const login = (req: Request, res: Response, next: NextFunction) => {
    const callback: AuthenticateCallback = (err, user, info: any) => {
        if (err) return next(err);

        if (!user) {
            return res.render("login", {
                username: req.body.username,
                errors: [{ msg: info?.message || "Invalid login" }]
            });
        }

        req.login(user, (err) => {
            if (err) return next(err);
            return res.redirect("/");
        });
    };

    passport.authenticate("local", callback)(req, res, next);
};

const loginView = (req: Request, res: Response) => {
    res.render("login")
}

const logout = (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
}


export { listAll, create, createView, signup, signupView, login, loginView, logout }
