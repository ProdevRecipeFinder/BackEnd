import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Step } from "../entities/Step";

@Resolver()
export class StepsResolver {
    @Query(() => [Step])
    getAllSteps() {
        return Step.find();
    }

    @Query(() => Step)
    getOneStep(
        @Arg("step_id") step_id: number
    ) {
        return Step.findOne(step_id);
    }

    @Mutation(() => Step)
    async createStep(
        @Arg("step_desc") step_desc?: string
    ): Promise<Step> {
        return Step.create({ step_desc: step_desc }).save();
    }

    @Mutation(() => Boolean)
    async deleteStep(
        @Arg("step_id") step_id: number
    ): Promise<Boolean> {
        await Step.delete(step_id);
        return true;
    }
}