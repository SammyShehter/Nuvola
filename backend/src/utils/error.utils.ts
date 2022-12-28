import {userErrorMessage} from "../types/error.type"
import { jsonValidationError } from "../types/http.types"

export class ErrorCodes {
    static get GENERAL_ERROR(): userErrorMessage {
        return {
            message: "GENERAL ERROR",
            action: "action message",
            innerMessage: "inner message",
        }
    }
    static get TOKEN_ABSENT(): userErrorMessage {
        return {
            message: "TOKEN ABSENT",
            action: "Please provide a valid user token",
            innerMessage: "no token provided",
        }
    }
    static get INVALID_TOKEN(): userErrorMessage {
        return {
            message: "INVALID TOKEN",
            action: "Please use a valid user token",
            innerMessage: "token is incorrect",
        }
    }
    static get USER_NOT_DEFINED(): userErrorMessage {
        return {
            message: "USER NOT DEFINED",
            action: "Internal error",
            innerMessage:
                "Middleware used incorrectly. It requeires defined user in req.user",
        }
    }
    static get USER_IS_NOT_PART_OF_COMMUNITY(): userErrorMessage {
        return {
            message: "USER IS NOT PART OF COMMUNITY",
            action: "You're not allowed to upload posts to communities you're not part of. Please join the community first",
            innerMessage:
                "User tried to upload post to community which he/she does not belong",
        }
    }
    static JSON_VALIDATION_FAILED({action, param}: jsonValidationError): userErrorMessage {
        return {
            message: "JSON VALIDATION FAILED",
            action,
            innerMessage: `User sent wrong ${param}`,
        }
    }
}
