import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log(typeof request.user.userId)
    return request.user.userId;
});