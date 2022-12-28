import { ObjectId } from "mongoose"
import { UserPost } from "./post.type"

export type Feed = {
    _id: ObjectId
    userId: ObjectId
    sameCountryPosts: Array<UserPost>
    differentCountryPosts: Array<UserPost>
}