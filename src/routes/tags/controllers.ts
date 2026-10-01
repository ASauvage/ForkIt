import type { Request, Response, NextFunction } from "express";
import { NotFoundError } from "@config/appError.js";
import type { Tag, SelectTagInput, CreateTagInput, UpdateTagInput } from "@app-types/tag.js";
import * as tagsServices from "./services.js";

export async function getTags(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const tags: Array<Tag> = await tagsServices.selectTags(res.locals.selectInput as SelectTagInput);
        
        res.status(200).json({ data: tags })
    } catch (error) {
        next(error);
    }
}

export async function postTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const tag: Tag = await tagsServices.insertTag(res.locals.createInput as CreateTagInput);

        res.status(200).json({ tag });
    } catch (error) {
        next(error);
    }
}

export async function getTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const tag: Tag | null = await tagsServices.selectTagById(req.params.id as string);

        if (!tag) {
            next(new NotFoundError());
        } else {
            res.status(200).json({ tag });
        }
    } catch (error) {
        next(error);
    }
}

export async function patchTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const tag: Tag | null = await tagsServices.updateTag(
            req.params.id as string,
            res.locals.updateInput as UpdateTagInput
        );

        if (!tag) {
            next(new NotFoundError());
        } else {
            res.status(200).json({ tag });
        }
    } catch (error) {
        next(error);
    }
}

export async function deleteTag(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const deleted: boolean = await tagsServices.deleteTag(req.params.id as string);

        if (!deleted) {
            next(new NotFoundError());
        } else {
            res.status(204).send();
        }
    } catch (error) {
        next(error);
    }
}
