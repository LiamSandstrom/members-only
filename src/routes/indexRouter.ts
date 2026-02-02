import { Router } from "express";
import { create, createView, deleteMessage, listAll, login, loginView, logout, manageAccount, manageAccountView, signup, signupView } from "../controllers/indexController.js";
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const indexRouter = Router()

indexRouter.get("/", isAuth, listAll)

indexRouter.get("/new", isAuth, createView)
indexRouter.post("/new", isAuth, create)

indexRouter.get("/log-in", loginView)
indexRouter.post("/log-in", login)

indexRouter.post("/log-out", logout)

indexRouter.get("/sign-up", signupView)
indexRouter.post("/sign-up", signup)

indexRouter.get("/manage-account", isAuth, manageAccountView)
indexRouter.post("/manage-account", isAuth, manageAccount)

indexRouter.post("/delete-message", isAuth, isAdmin, deleteMessage)
indexRouter.post("/delete-message", isAuth, isAdmin, deleteMessage)

export { indexRouter }

