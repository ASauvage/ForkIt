import 'dotenv/config';

export interface EnvConfig {
    port: number;
    nodeEnv: 'production' | 'development' | 'test';
    databaseUrl: string;
}

function getEnvVar(name: string, fallback?: string): string {
    const value = process.env[name] ?? fallback;

    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export const env: EnvConfig = {
    port: Number(getEnvVar('PORT', '3000')),
    nodeEnv: getEnvVar('NODE_ENV', 'production') as EnvConfig['nodeEnv'],
    databaseUrl: getEnvVar('DATABASE_URL'),
};
