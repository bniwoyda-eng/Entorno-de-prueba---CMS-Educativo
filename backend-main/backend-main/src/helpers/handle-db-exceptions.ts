import {
    BadRequestException,
    InternalServerErrorException,
    ConflictException,
    ForbiddenException,
    Logger,
    NotFoundException,
    HttpException
} from "@nestjs/common";

export const handleDBExceptions = (error: any, logger: Logger) => {
    if (error instanceof HttpException) throw error;

    const code = error?.code || error?.driverError?.code;

    logger.error(error.message, error.stack);

    switch (code) {
        case '23503':
            throw new ForbiddenException('Foreign key constraint violation');
        case '23505':
            throw new ConflictException('Record already exists');
        case '23502':
            throw new BadRequestException('Missing required fields');
        case '42601':
            throw new BadRequestException('Syntax error in SQL query');
        case '22001':
            throw new BadRequestException('String exceeds maximum length');
        case '22003':
            throw new BadRequestException('Numeric value out of range');
        case '23514':
            throw new BadRequestException('Value violates check constraint');
        default:
            logger.error('Unhandled DB error code:', code);
            throw new InternalServerErrorException('Unexpected database error');
    }
};
