import {Request, Response} from "express"
import PostService from "../services/post.service"
import {handleError, handleSuccess} from "../utils/common.utils"

class PostController {
    constructor() {
        console.log("PostController instance created")
    }

    readPost = async(req: Request, res: Response) => {
        try {
            const data = await PostService.readPost(req.params.slug)
            return handleSuccess(data, res)
        } catch (error) {
            return handleError(error, req, res)
        }
    }

    addPost = async (req: Request, res: Response) => {
        try {
            const data = await PostService.addPost(req.body)
            return handleSuccess(data, res)
        } catch (error) {
            return handleError(error, req, res)
        }
    }

    getPersonalFeed = async (req: Request, res: Response) => {
        try {
            const data = await PostService.getPersonalFeed(req.user._id)
            return handleSuccess(data, res)
        } catch (error) {
            return handleError(error, req, res)
        }
    }
}

export default new PostController()
