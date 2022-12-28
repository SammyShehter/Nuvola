import MongooseService from "./mongo.service"

class CommunityService {
    private db: typeof MongooseService

    constructor(DB: typeof MongooseService) {
        this.db = DB
        console.log("CommunityService instance created")
    }

}

export default new CommunityService(MongooseService)
