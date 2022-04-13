import { emailRegex, passwordRegex, usernameRegex } from "../../constants";
import { RegInfo } from "../../resolvers/ResTypes";
import { EMAI_INVALID, PASS_INVALID, UNAME_INVALID } from "./errorMsg";


export const validateRegister = (user_info: RegInfo) => {
    const uname = validateUname(user_info.user_name);
    if (uname) {
        return uname;
    }
    const email = validateEmail(user_info.email);
    if (email) {
        return email;
    }
    const pass = validatePassword(user_info.password);
    if (pass) {
        return pass;
    }

    return null;
}

export const validateUname = (uname: string) => {
    if (!usernameRegex.test(uname)) {
        return UNAME_INVALID;
    }
    return null;
}

export const validateEmail = (email: string) => {
    if (!emailRegex.test(email)) {
        return EMAI_INVALID;
    }
    return null;
}

export const validatePassword = (pass: string) => {
    if (!passwordRegex.test(pass)) {
        return PASS_INVALID;
    }
    return null;
}



