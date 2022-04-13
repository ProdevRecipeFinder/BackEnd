import { MiddlewareFn } from "type-graphql";
import { ServerContext } from "../types";

export const isAuth: MiddlewareFn<ServerContext> = ({ context }, next) => {
    if (context.req.session.userId) {
        throw new Error("not authenticated");
    }

    return next();
};