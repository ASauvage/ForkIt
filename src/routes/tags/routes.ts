import { Router } from "express";
import { validateGetTags, validatePostTag, validateGetTag, validatePatchTag } from "./validates.js";
import { getTags, postTag, getTag, patchTag, deleteTag } from "./controllers.js";

export const tagRouter = Router();

tagRouter.get("/", validateGetTags, getTags);
tagRouter.post("/", validatePostTag, postTag);
tagRouter.get("/:id", validateGetTag, getTag);
tagRouter.patch("/:id", validatePatchTag, patchTag);
tagRouter.delete("/:id", deleteTag);
