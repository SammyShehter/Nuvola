import {Request, Response, NextFunction} from "express"
import UserService from "../services/user.service"
import { handleError } from "../utils/common.utils"
import {ErrorCodes} from "../utils/error.utils"

class UserMiddleware {
    constructor() {
        console.log("UserMiddleware instance created")
    }

    auth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {token} = req.headers
            if (!token) throw ErrorCodes.TOKEN_ABSENT
            req.user = await UserService.getUser(token as string)
            if(!req.user) throw ErrorCodes.INVALID_TOKEN
            next()
        } catch (error) {
            handleError(error, req, res)
        }
    }
}

export default new UserMiddleware()
