import { NextFunction, Request, Response } from "express"

function isAuth(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).redirect("/log-in");
    }
}


export { isAuth }
