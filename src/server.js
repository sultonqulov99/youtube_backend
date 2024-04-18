import express from "express";
import cors from "cors"
import userRouter from "./routes/users.js"
import fileRouter from "./routes/files.js"
import fileUpload from "express-fileupload";
import fs from "fs"
import path from "path"

const PORT = process.env.PORT || 4545

const app = express()

app.use(express.json())
app.use(fileUpload())
app.use(cors())
app.use(express.static(path.join(process.cwd(),"src","uploads")))

app.use(userRouter)
app.use(fileRouter)

app.use((error,req,res,next) => {
    if(error.status != 500){
        return res.status(error.status).json({
            status:error.status,
            message:error.message,
            data: null,
            token:null
        })
    }

    fs.appendFileSync(path.join(process.cwd(),"src","log.txt"),
        `${req.method}___${req.url}___${Date.now()}___${error.status}__${error.message}\n`
    )
    res.status(error.status).json({
        status:error.status,
        message:"Internal server error",
        data: null,
        token:null
    })

})

app.listen(PORT, ()=>console.log("Server is run"))