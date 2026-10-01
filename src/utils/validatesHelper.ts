import type { JwtPayload } from "@app-types/jwtPayload.js";

export function isNonEmptyString(value: unknown): value is string {
    return typeof value === 'string' && value.trim().length > 0;
}

export function isPositiveNumber(value: unknown): value is number {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

export function isHexColor(value: unknown): value is string {
    return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

export function isValidUuid(value: unknown): value is string {
    return (
        typeof value === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
    );
}

export function isEnumValue(value: unknown, values: Array<string | number>): value is string {
    return values.includes(value as string | number);
}

export function isValidDate(value: unknown): value is string {
    if (typeof value !== "string" || value.trim() === "") {
        return false;
    }
    return !Number.isNaN(new Date(value).getTime());
}

export function hasQueryParams(query: Record<string, unknown>, excluded: Array<string>): boolean {
    return Object.keys(query).some(
        (key) => !excluded.includes(key)
    );
}

export function isJwtPayload(value: string | JwtPayload): value is JwtPayload {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof value.sub === "string" &&
        typeof value.permissions === "number"
    );
}
