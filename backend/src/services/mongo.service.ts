import mongoose, {ObjectId, Schema} from "mongoose"
import {EventEmitter} from "stream"
import {Community} from "../types/community.type"
import {Feed} from "../types/feed.type"
import {Post} from "../types/post.type"
import {User} from "../types/user.type"
import {randColor} from "../utils/common.utils"

class MongooseService {
    constructor() {
        console.log("MongooseService instance created")
    }

    private postSchema = new Schema<Post>(
        {
            title: {type: String, required: true},
            summary: {type: String, required: true},
            body: {type: String, required: true},
            slug: {type: String, required: true},
            author: {type: Schema.Types.ObjectId, ref: "users", required: true},
            community: {
                type: Schema.Types.ObjectId,
                ref: "communities",
                required: true,
            },
            likes: {type: Number, default: 0},
            status: {
                type: String,
                enum: ["Pending", "Approved"],
                default: "Pending",
            },
        },
        {timestamps: true, versionKey: false}
    )

    private communitySchema = new Schema<Community>(
        {
            title: {type: String, required: true},
            slug: {type: String, required: true},
            image: {
                type: String,
                default: `http://dummyimage.com/200x200.png/${randColor()}/ffffff`,
            },
            memberCount: {type: Number, required: true, default: 0},
        },
        {timestamps: true, versionKey: false}
    )

    private userSchema = new Schema<User>(
        {
            name: {type: String, required: true},
            token: {type: String, required: true, unique: true},
            role: {type: String, enum: ["moderator", "super moderator", null]},
            email: {type: String},
            image: {
                type: String,
                default: `http://dummyimage.com/200x200.png/${randColor()}/ffffff`,
            },
            country: {type: String, required: true, default: "israel"},
            communities: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "communities",
                },
            ],
        },
        {timestamps: true, versionKey: false}
    )

    private feedSchema = new Schema<Feed>(
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "users",
            },
            sameCountryPosts: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "posts",
                },
            ],
            differentCountryPosts: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "posts",
                },
            ],
        },
        {versionKey: false}
    )

    connectWithRetry = (
        eventEmmiter: EventEmitter,
        count: number = 0,
        retryAttempt: number = 5,
        retrySeconds: number = 5
    ) => {
        if (count >= retryAttempt) {
            console.log("Connection to Mongo DB failed")
            process.exit(1)
        }
        console.log("Attemptin to connect to Mongo DB")
        mongoose
            .connect(process.env["MONGO_CONNECTION_STRING"] as string, {
                dbName: "wisdo",
            })
            .then(() => {
                console.log("MongoDB is connected")
                eventEmmiter.emit("ready")
            })
            .catch(async (err) => {
                count++
                console.log(
                    `MongoDB connection failed, will retry ${count}/${retryAttempt} attempt after ${retrySeconds} seconds`,
                    err.message
                )
                setTimeout(
                    () => this.connectWithRetry(eventEmmiter, count),
                    retrySeconds * 1000
                )
            })
    }

    postStorage = mongoose.model<Post>("posts", this.postSchema)
    communityStorage = mongoose.model<Community>(
        "communities",
        this.communitySchema
    )
    usersStorage = mongoose.model<User>("users", this.userSchema)
    feedStorage = mongoose.model<Feed>("feed", this.feedSchema)

    usersCount = async (): Promise<number> => this.usersStorage.count()

    communitiesCount = async (): Promise<number> =>
        this.communityStorage.count()

    postsCount = async (): Promise<number> => this.postStorage.count()

    showUsers = async (): Promise<Array<User>> =>
        this.usersStorage
            .find({}, {_id: 0, name: 1, token: 1, role: 1, communities: 1})
            .populate({path: "communities", select: {_id: 0, slug: 1}})

    getModeratorsWithEmails = async () =>
        this.usersStorage
            .find(
                {
                    $and: [{role: {$ne: null}, email: {$ne: null}}],
                },
                {_id: 0, email: 1}
            )
            .lean()

    getUser = async (token: string): Promise<User> => {
        let rawUser = await this.usersStorage.findOne({token})
        if (rawUser)
            await rawUser.populate({path: "communities", select: {slug: 1}})
        return rawUser
    }

    addMockUsers = async (users: Array<User>) =>
        this.usersStorage.insertMany(users)

    addMockCommunities = async (communities: Array<Community>) =>
        this.communityStorage.insertMany(communities)

    addMockPosts = async (posts: Array<Post>) =>
        this.postStorage.insertMany(posts)

    addPost = async (post: Post) => this.postStorage.create({...post})

    readPost = async (slug: string) =>
        this.postStorage
            .findOne({slug}, {_id: 0})
            .populate("author", {_id: 0, name: 1, image: 1})
            .populate("community", {_id: 0, title: 1, image: 1, memberCount: 1})

    getPersonalFeed = async (userId: ObjectId) =>
        this.feedStorage
            .findOne({userId})
            .populate("sameCountryPosts", {
                _id: 0,
                title: 1,
                slug: 1,
                body: 1,
                summary: 1,
                likes: 1,
            })
            .populate("differentCountryPosts", {
                _id: 0,
                title: 1,
                slug: 1,
                body: 1,
                summary: 1,
                likes: 1,
            })
}

export default new MongooseService()
