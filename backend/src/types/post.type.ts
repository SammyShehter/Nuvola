import {ObjectId} from "mongoose"

export type Post = {
    _id: ObjectId
    title: string
    summary: string
    slug: string
    body: string
    author: string | ObjectId
    community: string | ObjectId
    likes: number
    status: "Pending" | "Approved"
}

export type PostWatchListCheck = {title: string, summary: string, body: string, slug: string}

export type UserPost = {title: string, summary: string, body: string, slug: string, likes: number}