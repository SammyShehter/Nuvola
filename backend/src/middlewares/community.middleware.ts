import {Request, Response, NextFunction} from "express"
import {Community} from "../types/community.type"
import {Post} from "../types/post.type"
import {User} from "../types/user.type"
import {handleError} from "../utils/common.utils"
import {ErrorCodes} from "../utils/error.utils"

class CommunityMiddleware {
    constructor() {
        console.log("CommunityMiddleware instance created")
    }

    userChecks = (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) throw ErrorCodes.USER_NOT_DEFINED
            const communityId = this.userIsMember(req.user, req.body)

            req.body.community = communityId
            req.body.author = req.user._id
            next()
        } catch (error) {
            handleError(error, req, res)
        }
    }

    userIsMember = (user: User, body: Post) => {
        if (!user.communities.length)
            throw ErrorCodes.USER_IS_NOT_PART_OF_COMMUNITY

        const communityIdFound: Community = (
            user.communities as Array<Community>
        ).find((community: Community) => community.slug === body.community)

        if (!communityIdFound) {
            throw ErrorCodes.USER_IS_NOT_PART_OF_COMMUNITY
        }

        return communityIdFound._id
    }
}

export default new CommunityMiddleware()
