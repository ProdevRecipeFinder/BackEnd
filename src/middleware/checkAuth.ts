import { MiddlewareFn } from "type-graphql";
import { ServerContext } from "../types";

export const checkAuth: MiddlewareFn<ServerContext> = ({ context }, next) => {
    if (context.req.session.userId) {
        throw new Error("not authenticated");
    }

    return next();
};