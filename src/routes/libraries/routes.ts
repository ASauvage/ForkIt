import { Router } from "express";
import { validateGetLibraries, validatePostLibrary, validateGetLibrary, validatePatchLibrary } from "./validates.js";
import { getLibraries, postLibrary, getLibrary, patchLibrary, deleteLibrary } from "./controllers.js";

export const librariesRouter = Router();

librariesRouter.get("/", validateGetLibraries, getLibraries);
librariesRouter.post("/", validatePostLibrary, postLibrary);
librariesRouter.get("/:id", validateGetLibrary, getLibrary);
librariesRouter.patch("/:id", validatePatchLibrary, patchLibrary);
librariesRouter.delete("/:id", deleteLibrary);
