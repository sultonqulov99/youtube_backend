import { InternalServerError, AuthorizationError } from "../utils/error.js"
import fs from "fs"
import path from "path"

const POST_FILES = (req,res,next) => {
    try {
        
        const { title, userId } = req.body 
        const { file } = req.files 

        let files = fs.readFileSync(path.join(process.cwd(),"src","db","files.json"),"utf-8")
        files = JSON.parse(files) || []

        let users = fs.readFileSync(path.join(process.cwd(),"src","db","users.json"),"utf-8")
        users = JSON.parse(users) || []

        let user = users.find(user => user.id == userId)

        if(!user){
            return next(new AuthorizationError(401,"Bunday foydalanuvchi topilmadi, file qo'sholmaysan"))
        }

        let fileName = new Date().getTime() + "." + file.name 

        let newFile = {
            id : files.length == 0 ? 1 : files[files.length-1].id + 1,
            userId,
            title,
            file: fileName,
            size: file.size / (1024*1024),
            date: new Date()

        }

        files.push(newFile)
        fs.writeFileSync(path.join(process.cwd(),"src","db","files.json"),JSON.stringify(files,null,4))

        file.mv(path.join(process.cwd(),"src","uploads",fileName),error => {
            console.log(error)
        })

        res.status(201).json({
            status:201,
            message:"File qo'shildi",
            data:newFile,
        })
    } catch (error) {
        return next(new InternalServerError(500,error.message))
    }
}

const FILE_GET = (req,res,next) => {
    try {
        const { userId } = req.params

        let files = fs.readFileSync(path.join(process.cwd(),"src","db","files.json"),"utf-8")
        files = JSON.parse(files) || []

        let file = files.filter(file => file.userId == userId)

        return res.status(200).json({
            status:200,
            message: "userga tegishli barcha videolar",
            data: file
        })

    } catch (error) {
        return next(new InternalServerError(500,error.message))
    }
}

const GET = (req,res,next) => {
    try {
        const { fileName } = req.query
        
        let files = fs.readFileSync(path.join(process.cwd(),"src","db","files.json"),"utf-8")
        files = JSON.parse(files) || []

        let users = fs.readFileSync(path.join(process.cwd(),"src","db","users.json"),"utf-8")
        users = JSON.parse(users) || []
        if(fileName){
            let file = files.filter(file => file.title.toLowerCase().includes(fileName.toLowerCase()))
            file = file.map(f => {
                f.user = users.find(user => user.id == f.userId)
                f.viewLink = f.file
                f.downloadLink = f.file 
    
                delete f.user.password 
    
                return f
            })
            return res.status(200).json({
                status:200,
                message:"ok",
                data:file
            })
        }else {
            files = files.map(file => {
                file.user = users.find(user => user.id == file.userId)
                file.viewLink = file.file
                file.downloadLink = file.file 
    
                delete file.user.password 
    
                return file
            })
        }

        return res.status(200).json({
            status:200,
            message:"hamma filelar userlar bilan",
            data: files
        })
    } catch (error) {
        return next(new InternalServerError(500,error.message))
    }
}

const DOWNLOAD = (req,res,next) => {
    try {
        const { fileName } = req.params

        res.download(path.join(process.cwd(),"src","uploads",fileName))
    } catch (error) {
        return next(new InternalServerError(500,error.message))
    }
}

const FILE_DELETE = (req,res,next) =>{
    try {
        const { fileId } = req.params

        let files = fs.readFileSync(path.join(process.cwd(),"src","db","files.json"),"utf-8")
        files = JSON.parse(files) || []

       files =  files.filter(file => file.id != fileId)

       fs.writeFileSync(path.join(process.cwd(),"src","db","files.json"),JSON.stringify(files,null,4))

       res.status(200).json({
        status:200,
        message: "File o'chirildi",
       })
    } catch (error) {
        return next(new InternalServerError(500,error.message))
    }
}

const UPDATE_FILE = (req,res,next) => {
    try {
        const { fileId } = req.params
        const { newTitle } = req.body

        let files = fs.readFileSync(path.join(process.cwd(),"src","db","files.json"),"utf-8")
        files = JSON.parse(files) || []

        let file = files.find(file => file.id == fileId)

        if(file){
            file.title = newTitle
        }

        fs.writeFileSync(path.join(process.cwd(),"src","db","files.json"),JSON.stringify(files,null,4))

        res.status(202).json({
            status:202,
            message: "File O'zgartirildi"
        })

    } catch (error) {
        return next(new InternalServerError(500,error.message))
    }
}

export default {
    POST_FILES,
    FILE_GET,
    GET,
    DOWNLOAD,
    FILE_DELETE,
    UPDATE_FILE
}