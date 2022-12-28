import mongoose, {Schema} from "mongoose"
import {EventEmitter} from "stream"
import {Feed, Post, User} from "./types"
import {randColor} from "./utils"

class MongooseService {
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

    constructor() {
        console.log("MongooseService instance created")
    }

    static connectWithRetry = (
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
                    () => MongooseService.connectWithRetry(eventEmmiter, count),
                    retrySeconds * 1000
                )
            })
    }

    postStorage = mongoose.model<Post>("posts", this.postSchema)
    usersStorage = mongoose.model<User>("users", this.userSchema)
    feedStorage = mongoose.model<Feed>("feed", this.feedSchema)

    lastPosts = async () =>
        this.postStorage
            .find({
                $and: [
                    {
                        createdAt: {
                            $gte: new Date(
                                new Date().getTime() - 1000 * 60 * 60 * 24 * 3
                            ),
                        },
                        status: "Approved",
                    },
                ],
            })
            .lean()
            .populate("author", {_id: 0, country: 1, likes: 1})
            .exec()

    getUsers = async () =>
        this.usersStorage.find({}, {country: 1, communities: 1}).lean().exec()

    populateFeed = async (feed: Array<Feed>) => {
        await this.feedStorage.deleteMany({})
        await this.feedStorage.insertMany(feed)
    }
}

export default MongooseService
