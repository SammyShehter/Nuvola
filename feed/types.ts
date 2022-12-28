import {ObjectId} from "mongoose"

export type configJson = {cronTask: string}

export type Post = {
    _id: ObjectId
    title: string
    summary: string
    slug: string
    body: string
    author: {country: string}
    community: string | ObjectId
    likes: number
    status: "Pending" | "Approved"
}

export type User = {
    _id: ObjectId
    name: string
    token: string
    role?: "moderator" | "super moderator"
    email?: string
    image?: string
    country: string
    communities: Array<string>
}

export type Feed = {
    _id: ObjectId
    userId: ObjectId
    sameCountryPosts: Array<ObjectId>
    differentCountryPosts: Array<ObjectId>
}