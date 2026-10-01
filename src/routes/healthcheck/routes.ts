import { Router } from "express";
import { getHealthcheck } from "./controller.js";

export const healthcheckRouter = Router();

healthcheckRouter.get("/", getHealthcheck);
