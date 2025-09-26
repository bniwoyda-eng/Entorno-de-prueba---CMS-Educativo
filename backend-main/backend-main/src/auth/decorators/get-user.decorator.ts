import { ExecutionContext, UnauthorizedException, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
        throw new UnauthorizedException('User not found in request');
    }

    return !data ? user : user[data];
});
