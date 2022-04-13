import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/User";


@EntityRepository(User)
export class UserRepository extends Repository<User> {

    findByUserName(user_info: string) {
        return this.findOne({ user_name: user_info });
    }

    findByEmail(user_info: string) {
        return this.findOne({ email: user_info })
    }
}