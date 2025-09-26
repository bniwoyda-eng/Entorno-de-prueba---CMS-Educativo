import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    STAGE: string;
    PORT: number;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_PORT: number;
    JWT_SECRET: string;
    SERVER_URL: string;
    CSM_OWNER_TENANT_ID: string;
    // APIs
    MAILER_EMAIL: string;
    MAILER_SECRET_KEY: string;
    MAILER_SERVICE: string;
    //AWS
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_BUCKET_NAME: string;
    //FRONTEND
    FRONTEND_URL: string;
}

const envsSchema = joi
    .object({
        STAGE: joi.string().required(),
        PORT: joi.number().required(),
        DB_NAME: joi.string().required(),
        DB_USERNAME: joi.string().required(),
        DB_PASSWORD: joi.string().required(),
        DB_HOST: joi.string().required(),
        DB_PORT: joi.number().required(),
        JWT_SECRET: joi.string().required(),
        SERVER_URL: joi.string().required(),
        CSM_OWNER_TENANT_ID: joi.string().required(),
        // APIs
        MAILER_EMAIL: joi.string().required(),
        MAILER_SECRET_KEY: joi.string().required(),
        MAILER_SERVICE: joi.string().required(),

        //AWS
        AWS_REGION: joi.string().required(),
        AWS_ACCESS_KEY_ID: joi.string().required(),
        AWS_SECRET_ACCESS_KEY: joi.string().required(),
        AWS_BUCKET_NAME: joi.string().required(),

        //FRONTEND
        FRONTEND_URL: joi.string().default('http://localhost:5173'),
    })
    .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    stage: envVars.STAGE,
    port: Number(envVars.PORT),
    db: {
        name: envVars.DB_NAME,
        user: envVars.DB_USERNAME,
        password: envVars.DB_PASSWORD,
        host: envVars.DB_HOST,
        port: Number(envVars.DB_PORT),
    },
    jwt_secret: envVars.JWT_SECRET,
    SERVER_URL: envVars.SERVER_URL,
    CSM_OWNER_TENANT_ID: envVars.CSM_OWNER_TENANT_ID,

    // APIs
    MAILER_EMAIL: envVars.MAILER_EMAIL,
    MAILER_SECRET_KEY: envVars.MAILER_SECRET_KEY,
    MAILER_SERVICE: envVars.MAILER_SERVICE,

    //AWS
    AWS_REGION: envVars.AWS_REGION,
    AWS_ACCESS_KEY_ID: envVars.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: envVars.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: envVars.AWS_BUCKET_NAME,

    //FRONTEND
    FRONTEND_URL: envVars.FRONTEND_URL,
};
