import express from "express";
import { join } from "path";
import "dotenv/config";
import { indexRouter } from "./routes/indexRouter.js";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import { db } from "./db/db.js";
import "./configs/passport-config.js"

const pgSession = connectPgSimple(session);

const app = express();

//----- GENERAL SETUP -----

app.set('views', join(import.meta.dirname, '../src/views'));
app.set('view engine', 'ejs');
app.use(express.static(join(import.meta.dirname, "../src/public")))

app.use(express.urlencoded({ extended: true }))

//----- SESSION -----

const pgStore = new pgSession({
    pool: db
})

app.use(session({
    secret: process.env.SECRET!,
    resave: true,
    saveUninitialized: true,
    store: pgStore,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    } // 30 days

}))

//----- PASSPORT AUTH -----

app.use(passport.initialize())
app.use(passport.session())

//make user avialible in views
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

//----- ROUTING -----

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
