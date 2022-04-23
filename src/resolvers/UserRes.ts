import argon2 from "argon2";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from "type-graphql";
import { getCustomRepository } from "typeorm";
import { v4 } from "uuid";
import { COOKIE_NAME, DELETE_ACCOUNT_PREFIX, FORGOT_PASS_PREFIX, ONE_DAY } from "../constants";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/UserRepo";
import { ServerContext } from "../types";
import { DELETE_SUCCESS, EMAIL_TAKEN, OLD_PASS_INCORRECT, PASS_INCORRECT, TOKEN_ERR_GENERIC, TOKEN_INVALID, UNAME_NOTFOUND, UNAME_TAKEN } from "../utils/errorHandling/errorMsg";
import { validatePassword, validateRegister, validateUname } from "../utils/errorHandling/validateRegister";
import { sendMail } from "../utils/sendMail";
import { UserDeleter } from "./helpers/userDeleter";
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

        const user = user_info.username.includes('@')
            ? await userRepo.findByEmail(user_info.username)
            : await userRepo.findByUserName(user_info.username)

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


    @Mutation(() => UserResponse)
    async changeUsername(
        @Arg("user_name") user_name: string,
        @Ctx() { req }: ServerContext
    ): Promise<UserResponse> {
        const userRepo = getCustomRepository(UserRepository);

        const user = await User.findOne(parseInt(req.session.userId));
        const notUnique = await userRepo.findByUserName(user_name);

        const errors = validateUname(user_name);
        if (errors) {
            return { errors }
        }

        if (!notUnique) {
            user!.user_name = user_name
        }
        User.save(user!);
        return { user };
    }

    @Mutation(() => UserResponse)
    async changePassword(
        @Arg("oldPass") oldPass: string,
        @Arg("newPass") newPass: string,
        @Ctx() { req }: ServerContext
    ): Promise<UserResponse> {
        const user = await User.findOne(parseInt(req.session.userId));

        const checkOldPass = await argon2.verify(user!.password, oldPass);
        if (!checkOldPass) {
            return { errors: OLD_PASS_INCORRECT }
        }

        const validate = validatePassword(newPass);
        if (validate) {
            return { errors: validate }
        }

        user!.password = await argon2.hash(newPass);
        User.save(user!);

        req.session.userId = user!.id;
        return { user };
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
        const html = `
        <div>
            <div style="margin: 0 auto; border: 1px solid grey; border-radius: 0.5em; padding: 2em; text-align: center;">
            <h1>Reset your RecipeFinder password</h1>
            <p>We heard that you lost your GitHub password. Sorry about that!</p>
            <p>But don’t worry! You can use the following button to reset your password:</p> 
            <a href="${process.env.CORS_ORIGIN}/reset-password/${token}">
                <button style="padding: 1em; background: rgb(72, 170, 72); color: white; border: none; border-radius: 0.5em;">Reset your Password</button>
            </a>
            <p>If you don’t use this link within 24 hours, it will expire. To get a new password reset link, go <a href="https://findmesome.recipes/reset-password">here</a></p>
            </div>
        <div>
        `;
        await sendMail(email, html);
        return true;
    }

    @Mutation(() => UserResponse)
    async changeForgotPassword(
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

    @Mutation(() => Boolean)
    async requestDeleteAccount(
        @Ctx() { req, redis }: ServerContext
    ): Promise<Boolean> {
        const user = await User.findOne(
            {
                id: parseInt(req.session.userId)
            }
        )
        if (!user) {
            return true;
        }
        const token = v4();
        await redis.set(DELETE_ACCOUNT_PREFIX + token, user.id, 'ex', ONE_DAY);
        const html = `<a href="${process.env.CORS_ORIGIN}/delete-account/${token}">Delete Account</a>`;
        await sendMail(user.email, html);
        return true;
    }

    @Mutation(() => UserResponse)
    async deleteAccount(
        @Arg("token") token: string,
        @Ctx() { redis }: ServerContext
    ): Promise<UserResponse> {

        const userId = await redis.get(DELETE_ACCOUNT_PREFIX + token);
        if (!userId) {
            return { errors: TOKEN_INVALID }
        }
        const user = await User.findOne(parseInt(userId));
        if (!user) {
            return { errors: TOKEN_ERR_GENERIC }
        }

        UserDeleter(user.id);

        return { errors: DELETE_SUCCESS };
    }

}