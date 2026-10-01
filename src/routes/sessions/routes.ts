import { Router } from "express";
import { validatePostLogin } from "./validates.js";
import { postLogin, getLogout } from "./controllers.js";

export const sessionsRouter = Router();

sessionsRouter.post("/login", validatePostLogin, postLogin);
sessionsRouter.get("/logout", getLogout);
