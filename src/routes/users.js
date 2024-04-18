import express from "express"
import userController from "../controller/users.js"
import userMiddleware from "../middleware/volidations.js"

const {Router}  = express

const router = Router()

router.get("/api/users",userController.GET)

router.post("/api/register",userMiddleware,userController.REGISTER)
router.post("/api/login",userMiddleware,userController.LOGIN)

export default router