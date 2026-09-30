import { Router } from "express";
import { validateGetTags, validatePostTag, validateGetTag, validatePatchTag } from "./validates.js";
import { getTags, postTag, getTag, patchTag, deleteTag } from "./controllers.js";

export const tagsRouter = Router();

tagsRouter.get("/", validateGetTags, getTags);
tagsRouter.post("/", validatePostTag, postTag);
tagsRouter.get("/:id", validateGetTag, getTag);
tagsRouter.patch("/:id", validatePatchTag, patchTag);
tagsRouter.delete("/:id", deleteTag);
