import { body, validationResult } from "express-validator"
import { getUserFromUsername } from "../db/queries.js";

const alphaErr = "must only contain letters.";
const getLengthErr = (field: string, min: number, max: number) => {
    return `${field} must be between ${min} and ${max} characters.`
}

const validateSignupForm = [
    body("firstname").trim()
        .notEmpty().withMessage("First name is required")
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 30 }).withMessage(getLengthErr("First name", 1, 30)),
    body("lastname").trim()
        .notEmpty().withMessage("Last name is required")
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 30 }).withMessage(getLengthErr("Last Name", 1, 30)),
    body("username").trim()
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 1, max: 20 }).withMessage(getLengthErr("Username", 1, 20))
        .custom((async value => {
            const user = await getUserFromUsername(value)
            if (user) throw new Error("Username already in use")
            return true;
        })),
    body("password").trim()
        .notEmpty().withMessage("Please enter a password (6-20 characters)")
        .isLength({ min: 6, max: 20 }).withMessage(getLengthErr("Password", 6, 20)),
    body("confirmpassword")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Password & confirm password does not match ")
            }
            return true;
        })
];

export { validateSignupForm }
