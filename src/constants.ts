export const __prod__ = process.env.NODE_ENV === "production";
export const COOKIE_NAME = "qid";
export const FORGOT_PASS_PREFIX = "forgot-pass:";
export const ONE_DAY = 1000 * 60 * 60 * 24;




export const usernameRegex = /^[a-zA-Z0-9_.]{5,15}$/;
export const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
export const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,16}$/;
