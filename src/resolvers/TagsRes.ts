import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Tag } from "../entities/Tag";

@Resolver()
export class TagsResolver {
    @Query(() => [Tag])
    getAllTags() {
        return Tag.find();
    }

    @Query(() => Tag)
    getOneTag(
        @Arg("tag_id") tag_id: number
    ) {
        return Tag.findOne(tag_id);
    }

    @Mutation(() => Tag)
    async createTag(
        @Arg("tag_name") tag_name: string,
        @Arg("tag_desc") tag_desc?: string
    ): Promise<Tag> {
        return Tag.create({ tag_name: tag_name, tag_desc: tag_desc }).save();
    }

    @Mutation(() => Boolean)
    async deleteTag(
        @Arg("tag_id") tag_id: number
    ): Promise<Boolean> {
        await Tag.delete(tag_id);
        return true;
    }
}