import {ObjectId} from "mongoose"
import { Community } from "./community.type"

export type User = {
    _id: ObjectId
    name: string
    token: string
    role?: "moderator" | "super moderator"
    email?: string
    image?: string
    country: string
    communities: Array<string> | Array<Community>
}
