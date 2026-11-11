import { ProfileSchema } from "@/lib/types";
import { ProfileRepository } from "./repository";

export class ProfileService {
    private readonly repo: ProfileRepository

    constructor(profileRepository: ProfileRepository) {
        this.repo = profileRepository
    }

    public async getUserProfile(userID: string): Promise<ProfileSchema> {
        return await this.repo.findProfileByUserID(userID)
    }
}
