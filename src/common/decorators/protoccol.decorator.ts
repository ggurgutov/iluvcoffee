import {
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';

export const Protocol = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        console.log('Default value', data);
        const request = ctx.switchToHttp().getRequest();
        return request.protocol;
    },
);