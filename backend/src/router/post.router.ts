import express from "express"
import PostMiddleware from "../middlewares/post.middleware"
import PostController from "../controllers/post.controller"
import UserMiddleware from "../middlewares/user.middleware"
import CommunityMiddleware from "../middlewares/community.middleware"

export const router = express.Router()

router.post(
    "/add",
    UserMiddleware.auth,
    PostMiddleware.bodyFieldsChecks,
    CommunityMiddleware.userChecks,
    PostController.addPost
)
router.get('/feed', UserMiddleware.auth, PostController.getPersonalFeed)

router.get('/read/:slug', PostMiddleware.paramChecks, PostController.readPost)
