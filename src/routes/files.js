import express from "express"

import filesMiddleware from "../middleware/volidations.js"
import controllerFiles from "../controller/files.js"

const {Router}  = express

const router = Router()

router.post("/api/files",filesMiddleware, controllerFiles.POST_FILES)

router.get("/api/file/:userId",controllerFiles.FILE_GET)
router.get("/api/files",controllerFiles.GET)
router.get("/api/files/download/:fileName", controllerFiles.DOWNLOAD)

router.delete("/api/delete-file/:fileId",controllerFiles.FILE_DELETE)
   
router.put("/api/update-file/:fileId",controllerFiles.UPDATE_FILE)

export default router