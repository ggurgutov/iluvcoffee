import { NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

export class LoggingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: (error?: Error | any) => void) {
        console.log('Hi from middleware');
        res.on('finish', () => console.timeEnd(`Request-response time`));
        next();
    }
}