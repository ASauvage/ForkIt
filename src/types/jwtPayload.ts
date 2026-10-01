export interface JwtPayload {
    sub: string;
    permissions: number;
    iat: number;
    exp: number;
}
