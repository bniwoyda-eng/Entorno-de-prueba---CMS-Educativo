import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ErrorHandlingInterceptor } from './common/interceptors/error-handling.interceptor';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { envs } from './config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const logger = new Logger('Bootstrap');

    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(new ErrorHandlingInterceptor());
    // app.useGlobalInterceptors(new HttpLoggerInterceptor());
    Logger.overrideLogger(['log', 'error', 'warn', 'debug', 'verbose']);
    if (process.env.STAGE === 'PRODUCTION') {
        Logger.overrideLogger(['log', 'error', 'warn']);
    }

    app.enableCors({
        origin: '*',
        methods: '*',
        allowedHeaders: '*',
        preflightContinue: false,
        optionsSuccessStatus: 204,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    );

    app.use(bodyParser.json({ limit: '30mb' }));
    app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

    // const config = new DocumentBuilder()
    //     .addBearerAuth()
    //     .setTitle('CSM API')
    //     .setDescription('CSM endpoints')
    //     .setVersion('1.0')
    //     .build();
    // const document = SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup('/docs/api', app, document, {
    //     swaggerOptions: {
    //       docExpansion: 'none', 
    //     },
    //   });

    await app.listen(envs.port);
    logger.log(`App running on port ${envs.port}`);
}
bootstrap();
