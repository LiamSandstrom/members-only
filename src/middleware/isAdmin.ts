import { NextFunction, Request, Response } from "express"

function isAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user?.admin) {
        return next();
    }
    res.status(403).redirect("/");
}

export { isAdmin }
