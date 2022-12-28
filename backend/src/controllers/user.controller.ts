import {Request, Response} from "express"
import UserService from "../services/user.service"
import {handleError, handleSuccess} from "../utils/common.utils"

class CommunityController {
    constructor() {
        console.log("CommunityController instance created")
    }

    showUsers = async (req: Request, res: Response) => {
        try {
            const data = await UserService.showUsers()

            return handleSuccess(data, res)
        } catch (error) {
            return handleError(error, req, res)
        }
    }
}

export default new CommunityController()
