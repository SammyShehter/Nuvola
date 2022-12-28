import express from "express"
import UserMiddleware from "../middlewares/user.middleware"
import UserController from "../controllers/user.controller"

export const router = express.Router()

router.get(
    "/list",
    UserController.showUsers
)