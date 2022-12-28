import fs from "fs"
import MongoService from "../services/mongo.service"
import {EventEmitter} from "stream"
import {watchListInit} from "./bad-words"

export const initEvents = new EventEmitter()

export async function init() {
    //check that env file exists
    if (process.env.INIT !== "fine") {
        console.log("env file is not confiured")
        process.exit(1)
    }

    // watchlist Check
    watchListInit("watchlist.txt") // TODO move to env var?

    // check data base connection
    MongoService.connectWithRetry(initEvents)

    // populate db with mock data
    const mockData = JSON.parse(fs.readFileSync("mock-data.json").toString())
    const dbEntriesCountArr: Array<number> = await Promise.all([
        MongoService.usersCount(),
        MongoService.communitiesCount(),
        MongoService.postsCount(),
    ])

    const dbEntriesCount = dbEntriesCountArr.reduce(
        (acc, curr) => acc + curr,
        0
    )
    if (!dbEntriesCount) {
        Promise.all([
            MongoService.addMockUsers(mockData.users),
            MongoService.addMockCommunities(mockData.communities),
            MongoService.addMockPosts(mockData.posts),
        ])
        console.log("Database populated with mock data")
    }
}
