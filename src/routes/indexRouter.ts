import { Router } from "express";
import { becomeMember, becomeMemberView, create, createView, listAll, login, loginView, logout, signup, signupView } from "../controllers/indexController.js";
import { isAuth } from "../middleware/isAuth.js";

const indexRouter = Router()

indexRouter.get("/", isAuth, listAll)

indexRouter.get("/new", isAuth, createView)
indexRouter.post("/new", isAuth, create)

indexRouter.get("/log-in", loginView)
indexRouter.post("/log-in", login)

indexRouter.post("/log-out", logout)

indexRouter.get("/sign-up", signupView)
indexRouter.post("/sign-up", signup)

indexRouter.get("/become-member", isAuth, becomeMemberView)
indexRouter.post("/become-member", isAuth, becomeMember)

export { indexRouter }

