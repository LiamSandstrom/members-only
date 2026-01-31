import { NextFunction, Request, Response } from "express"
import { CreateUserInput } from "../models/createUserInput.js"
import { validateSignupForm } from "../service/validation.js"
import { matchedData, validationResult } from "express-validator"
import { createUser } from "../db/queries.js"
import passport, { AuthenticateCallback } from "passport"

const listAll = (req: Request, res: Response) => {
    res.render("index")
}

const create = (req: Request, res: Response) => {

}

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
        console.error('Signup error:', err);
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
