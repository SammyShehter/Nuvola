import {ObjectId} from "mongoose"
import {Feed} from "../types/feed.type"
import { singleAnswer } from "../types/http.types"
import {Post, PostWatchListCheck, UserPost} from "../types/post.type"
import {pattern} from "../utils/bad-words"
import {feedSorting} from "../utils/common.utils"
import MongooseService from "./mongo.service"
import UserService from "./user.service"

class PostService {
    private db: typeof MongooseService
    constructor(DB: typeof MongooseService) {
        this.db = DB
        console.log("PostService instance created")
    }

    private checkSummary = (summary: string | undefined, body: string) =>
        summary ? summary : body.substring(0, 100)

    private createSlug = (title: string) => title.split(" ").join("_")

    private checkPostForWatchWords = async (postChecks: PostWatchListCheck) => {
        let problemIn: Array<string> = []

        for (const key in postChecks) {
            if (Object.prototype.hasOwnProperty.call(postChecks, key)) {
                const element = postChecks[key]
                pattern.test(element) && problemIn.push(key)
            }
        }

        if (problemIn.length) {
            UserService.sendEmail({
                to: UserService.moderatorsWithEmails,
                subject: `Watch List detection`,
                body: `Watch list matched in new post. Problems found in posts ${problemIn.join(
                    ", "
                )}. URL to the post ${process.env.URL}/post/read/${
                    postChecks.slug
                }`,
            })
        }
    }

    readPost = async (slug: string): Promise<Post> => this.db.readPost(slug)

    addPost = async (post: Post): Promise<singleAnswer> => {
        post.summary = this.checkSummary(post.summary, post.body)
        post.slug = this.createSlug(post.title)

        const {title, summary, body, slug}: Post = await this.db.addPost(post)
        this.checkPostForWatchWords({title, summary, body, slug})
        return {
            message: `New post '${title}' has been added successfully`,
        }
    }

    getPersonalFeed = async (userId: ObjectId): Promise<Array<UserPost>> => {
        const data: Feed = await this.db.getPersonalFeed(userId)
        if (!data) {
            return []
        }
        let result: Array<UserPost> = [
            ...data.sameCountryPosts.sort(feedSorting),
            ...data.differentCountryPosts.sort(feedSorting),
        ]
        return result
    }
}

export default new PostService(MongooseService)
