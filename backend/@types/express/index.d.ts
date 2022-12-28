import express = require("express")
import {decodedUser} from "../../src/common/common.types"
import { User } from "../../src/types/user.type"

declare global {
    namespace Express {
        interface Request {
            correlation_id: string
            user: User
        }
    }
}
