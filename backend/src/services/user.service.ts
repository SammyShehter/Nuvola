import {User} from "../types/user.type"
import {ErrorCodes} from "../utils/error.utils"
import MongooseService from "./mongo.service"

class UserService {
    private db: typeof MongooseService
    public moderatorsWithEmails: Array<string> = []

    constructor(DB: typeof MongooseService) {
        this.db = DB
        this.updateModeratorsWithEmails()
        console.log("UserService instance created")
    }

    updateModeratorsWithEmails = async () => {
        const moderators = await MongooseService.getModeratorsWithEmails()
        this.moderatorsWithEmails = moderators.map((item) => item.email)
    }

    sendEmail({
        to,
        subject,
        body,
    }: {
        to: string[]
        subject: string
        body: string
    }) {
        console.log("sendEmail called", {to, subject, body})
    }

    getUser = async (token: string): Promise<User> => {
        return this.db.getUser(token)
    }

    showUsers = async (): Promise<Array<User>> => {
        const data = await this.db.showUsers()

        if (!data) throw ErrorCodes.GENERAL_ERROR

        return data
    }
}

export default new UserService(MongooseService)
