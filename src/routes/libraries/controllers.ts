import type { Request, Response, NextFunction } from "express";
import { NotFoundError } from "@config/appError.js";
import type { Library, IncludedLibraryFields, SelectLibraryInput, CreateLibraryInput, UpdateLibraryInput } from "@app-types/library.js";
import * as librariesServices from "./services.js";

export async function getLibraries(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const libraries: Array<Library> = await librariesServices.selectLibraries(
            res.locals.selectInput as SelectLibraryInput,
            res.locals.includedFields as IncludedLibraryFields
        );
        
        res.status(200).json({ data: libraries })
    } catch (error) {
        next(error);
    }
}

export async function postLibrary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const library: Library = await librariesServices.insertLibrary(
            req.user!.id as string,
            res.locals.createInput as CreateLibraryInput
        );

        res.status(200).json({ library });
    } catch (error) {
        next(error);
    }
}

export async function getLibrary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const library: Library | null = await librariesServices.selectLibraryById(
            req.params.id as string,
            res.locals.includedFields as IncludedLibraryFields
        );

        if (!library) {
            next(new NotFoundError());
        } else {
            res.status(200).json({ library });
        }
    } catch (error) {
        next(error);
    }
}

export async function patchLibrary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const library: Library | null = await librariesServices.updateLibrary(
            req.params.id as string,
            res.locals.updateInput as UpdateLibraryInput
        );

        if (!library) {
            next(new NotFoundError());
        } else {
            res.status(200).json({ library });
        }
    } catch (error) {
        next(error);
    }
}

export async function deleteLibrary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const deleted: boolean = await librariesServices.deleteLibrary(req.params.id as string);

        if (!deleted) {
            next(new NotFoundError());
        } else {
            res.status(204).send();
        }
    } catch (error) {
        next(error);
    }
}
