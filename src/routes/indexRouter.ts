import { Router } from "express";
import { create, createView, listAll, login, loginView, logout, signup, signupView } from "../controllers/indexController.js";

const indexRouter = Router()

indexRouter.get("/", listAll)

indexRouter.get("/new", createView)
indexRouter.post("/new", create)

indexRouter.get("/log-in", loginView)
indexRouter.post("/log-in", login)

indexRouter.post("/log-out", logout)

indexRouter.get("/sign-up", signupView)
indexRouter.post("/sign-up", signup)

export { indexRouter }

