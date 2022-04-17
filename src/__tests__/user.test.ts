import { User } from "../entities/User";
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

test("Registers new User", async () => {
    const newUser = await User.create({
        user_name: testUserSetup.user_name,
        email: testUserSetup.email,
        password: testUserSetup.password
    }).save()
    expect(newUser).toBe(typeof User);
})
