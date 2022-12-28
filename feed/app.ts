import fs from "fs"
import cron from "node-cron"
import {EventEmitter} from "stream"
import MongooseService from "./mongo"
import {configJson, Post} from "./types"

// init events
const initEvents = new EventEmitter()
MongooseService.connectWithRetry(initEvents)

//funcs
const readConfig = (configFileName: string): configJson =>
    JSON.parse(fs.readFileSync(configFileName).toString())

const updateFeed = async (db: MongooseService): Promise<void> => {
    const communities = new Map()
    // get all posts last three days with their countries
    const posts: Array<Post> = await db.lastPosts() // last 3 days posts

    // start loop with sorting alghoritm community/country/likes
    for (const post of posts) {
        const community = post.community.toString()
        const country = post.author.country
        if (!communities.has(community)) {
            communities.set(community, {[country]: [post._id]})
        } else {
            const updated = {...communities.get(community)}
            updated[country].push(post._id)
            communities.set(community, updated)
        }
    }

    // get all users
    const users = await db.getUsers()
    // start loop for feed collection
    const feed: any = {}
    for (const user of users) {
        const userId = user._id.toString()
        feed[userId] = {sameCountryPosts: [], differentCountryPosts: []}
        for (const community of user.communities) {
            const updated = {...feed[userId]}
            const communityPosts = {...communities.get(community.toString())}
            const sameCountryPosts = communityPosts[user.country]
            if (sameCountryPosts && sameCountryPosts.length) {
                updated.sameCountryPosts.push(...sameCountryPosts)
                delete communityPosts[user.country]
            }
            const differentCountryPosts = communityPosts
            if (differentCountryPosts && differentCountryPosts.length) {
                for (const key in differentCountryPosts) {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            differentCountryPosts,
                            key
                        )
                    ) {
                        updated.differentCountryPosts.push(
                            ...differentCountryPosts[key]
                        )
                    }
                }
            }

            feed[userId] = updated
        }
    }
    // normilize feed to be an array of objects
    const feedArray = []
    for (const userId in feed) {
        if (Object.prototype.hasOwnProperty.call(feed, userId)) {
            feedArray.push({userId, ...feed[userId]})
        }
    }
    // submit feet to db
    db.populateFeed(feedArray)
    //exit
    console.log(new Date().toLocaleString(), "\nFeed update is DONE!\n")
}

const startCron = (
    cronTask: string,
    db: MongooseService
): cron.ScheduledTask => {
    return cron.schedule(cronTask, () => updateFeed(db))
}

const checkIfConfigChanged = (
    cronTask: string,
    configFileName: string,
    scheduledTask: cron.ScheduledTask,
    db: MongooseService
): void => {
    const config = readConfig(configFileName)
    if (config.cronTask !== cronTask) {
        cronTask = config.cronTask
        scheduledTask.stop()
        scheduledTask = startCron(cronTask, db)
    }
}

const startFeedApp = (): void => {
    const db = new MongooseService()
    const configFileName = "./config.json"
    let {cronTask} = readConfig(configFileName)
    let task = startCron(cronTask, db)
    updateFeed(db)
    setInterval(
        () => checkIfConfigChanged(cronTask, configFileName, task, db),
        30000
    )
}

//ignite
initEvents.once("ready", startFeedApp)
