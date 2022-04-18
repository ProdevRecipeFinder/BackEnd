import { getCustomRepository } from "typeorm";
import { User } from "../../entities/User";
import { UserRepository } from "../../repositories/UserRepo";
import connection from "./setup/connection";

beforeAll(async () => {
    await connection.create();
});

afterAll(async () => {
    await connection.close();
});

beforeEach(async () => {
    await connection.clear();
});

let testUserSetup = {
    user_name: "test_user_1",
    email: "test_user_mail@mail.com",
    password: "testPass123!"
}
//Fail due to bad UserName
//Fail due to bad Email
//Fail due to bad Pass
//Fail due to taken UserName
//Fail due to taken Email

//Successful Register
test("Registers new User", async () => {
    const newUser = await User.create({
        user_name: testUserSetup.user_name,
        email: testUserSetup.email,
        password: testUserSetup.password
    }).save()
    expect(newUser).toBe(typeof User);
})

test("Login as User with UserName", async () => {
    const userRepo = getCustomRepository(UserRepository);
    const user = await userRepo.findByUserName(testUserSetup.user_name);
    expect(user)
})

