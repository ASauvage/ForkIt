export function isNonEmptyString(value: unknown): boolean {
    return typeof value === 'string' && value.trim().length > 0;
}

export function isPositiveNumber(value: unknown): boolean {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

export function isHexColor(value: unknown): boolean {
    return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

export function isValidUuid(value: unknown): boolean {
    return (
        typeof value === 'string' &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
    );
}

export function isEnumValue(value: unknown, values: Array<string | number>): boolean {
    return values.includes(value as string | number);
}

export function isValidDate(value: unknown): boolean {
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
