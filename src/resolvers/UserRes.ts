import argon2 from "argon2";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { getCustomRepository } from "typeorm";
import { v4 } from "uuid";
import { COOKIE_NAME, FORGOT_PASS_PREFIX, ONE_DAY } from "../constants";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepo";
import { ServerContext } from "../types";
import { EMAIL_TAKEN, PASS_INCORRECT, TOKEN_ERR_GENERIC, TOKEN_INVALID, UNAME_NOTFOUND, UNAME_TAKEN } from "../utils/errorHandling/errorMsg";
import { validatePassword, validateRegister } from "../utils/errorHandling/validateRegister";
import { sendMail } from "../utils/sendMail";
import { LoginInfo, RegInfo, UserResponse } from "./ResTypes";

@Resolver(User)
export class UserResolver {

    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() { req }: ServerContext) {
        //Field Access Authorized
        if (req.session.userId === user.id) {
            return user.email
        }

        //Field Access Unauthorized
        return "";
    }

    //WHO AM I

    @Query(() => User, { nullable: true })
    async whoami(
        @Ctx() { req }: ServerContext
    ) {
        //not logged in
        if (!req.session.userId) {
            return null
        }

        const user = await User.findOne(req.session!.userId);
        return user;
    }

    //REGISTER

    @Mutation(() => UserResponse)
    async register(
        @Arg("user_info") user_info: RegInfo,
        @Ctx() { req }: ServerContext
    ): Promise<UserResponse> {
        const userRepo = getCustomRepository(UserRepository);
        const errors = validateRegister(user_info);

        if (errors) {
            return { errors };
        }

        if (await userRepo.findByUserName(user_info.user_name)) {
            return { errors: UNAME_TAKEN }
        }

        if (await userRepo.findByEmail(user_info.email)) {
            return { errors: EMAIL_TAKEN }
        }

        const hashedPass = await argon2.hash(user_info.password)
        const user = User.create({ user_name: user_info.user_name, email: user_info.email, password: hashedPass });
        await user.save();

        req.session.userId = user.id;
        return { user };
    }

    //LOGIN

    @Mutation(() => UserResponse)
    async login(
        @Arg("user_info") user_info: LoginInfo,
        @Ctx() { req }: ServerContext
    ): Promise<UserResponse> {
        const userRepo = getCustomRepository(UserRepository);
        const user = await userRepo.findByUserName(user_info.username);
        if (!user) {
            return { errors: UNAME_NOTFOUND };
        }

        const validate = await argon2.verify(user.password, user_info.password);
        if (!validate) {
            return { errors: PASS_INCORRECT };
        }

        req.session.userId = user.id;
        return { user };
    }

    // LOGOUT

    @Mutation(() => Boolean)
    async logout(
        @Ctx() { req, res }: ServerContext
    ) {
        return new Promise((resolve) => {
            req.session?.destroy((err) => {
                res.clearCookie(COOKIE_NAME);
                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                }
                resolve(true);
            })
        })
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
        @Ctx() { redis }: ServerContext
    ): Promise<Boolean> {
        const userRepo = getCustomRepository(UserRepository);
        const user = await userRepo.findByEmail(email);
        if (!user) {
            return true;
        }
        const token = v4();
        await redis.set(FORGOT_PASS_PREFIX + token, user.id, 'ex', ONE_DAY);
        const html = `<a> href="${process.env.FRONTEND_TARGET}/change-password/${token}"</a>`;
        await sendMail(email, html);
        return true;
    }

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("token") token: string,
        @Arg("newPass") newPass: string,
        @Ctx() { req, redis }: ServerContext
    ): Promise<UserResponse> {
        const validate = validatePassword(newPass);
        if (validate) {
            return { errors: validate }
        }
        const userId = await redis.get(FORGOT_PASS_PREFIX + token);
        if (!userId) {
            return { errors: TOKEN_INVALID }
        }
        const user = await User.findOne(parseInt(userId));
        if (!user) {
            return { errors: TOKEN_ERR_GENERIC }
        }
        user.password = await argon2.hash(newPass);
        User.save(user);

        req.session.userId = user.id;
        return { user };
    }
}