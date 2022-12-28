import {ObjectId} from "mongoose"

export type Community = {
    _id: ObjectId
    slug: string
    title: string
    image: string
    memberCount: number
}
