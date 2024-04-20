import { AuthorizationError, InternalServerError } from "../utils/error.js"
import fs from "fs"
import path from "path"
import sha256 from "sha256"
import JWT from "jsonwebtoken"

const REGISTER = (req,res,next) => {
    try {
        let {userName,password} = req.body 
        let {profilImg} = req.files 
        
        let users = fs.readFileSync(path.join(process.cwd(),"src","db","users.json"),"utf-8")
        users = JSON.parse(users) || []
        
        let fileName = new Date().getTime() + "." + profilImg.name 
     
        let newUser = {
            id:users.length ? users[users.length - 1].id + 1 : 1,
            userName,
            password: sha256(password),
            profilImg:fileName
        }

        users.push(newUser)

        fs.writeFileSync(path.join(process.cwd(),"src","db","users.json"),JSON.stringify(users,null,4))
        profilImg.mv(path.join(process.cwd(),"src","uploads",fileName),error => {
            console.log(error)
        })

        return res.status(201).json({
            status:201,
            message:"Malumot qo'shildi",
            data:newUser,
            token:JWT.sign({userId:newUser.id},"shaftoli",{expiresIn:300})
        })
    } catch (error) {
        return next(new InternalServerError(500,error.message))
    }
}

const LOGIN = (req,res,next) => {
    try {
        let {userName,password} = req.body 

        let users = fs.readFileSync(path.join(process.cwd(),"src","db","users.json"),"utf-8")
        users = JSON.parse(users) || []

        let user = users.find(user => user.userName == userName && user.password == sha256(password))

        if(!user){
            return next(new AuthorizationError(404,"Foydalanuvchi topilmadi"))
        }

        delete user.password

        return res.status(200).json({
            status:200,
            message:"Foydalanuvchi topildi",
            data:user,
            token:JWT.sign({userId:user.id},"shaftoli",{expiresIn:300})
        })

    } catch (error) {
        return next(new InternalServerError(500,error.message))
    }
}

const GET = (req,res,next) => {
    try {
        let users = fs.readFileSync(path.join(process.cwd(),"src","db","users.json"),"utf-8")
        users = JSON.parse(users) || []

        users = users.map(user => {
            delete user.password 

            return user
        })

        return res.status(200).json({
            status:200,
            message: "Hamma userlar",
            data:users
        })

    } catch (error) {
        return next(new InternalServerError(500,error.message))
    }
}
const VERFY = (req,res,next) => {
    try {
        const {token} = req.params
        let user = JWT.verify(token,"shaftoli")
        if(user){
            return res.status(200).json({
                message:"Token valid"
            })
        }
        return res.statu(400).json({
            message:"Token invalid"
        })
        
    } catch (error) {
        return next(new InternalServerError(500,error.message))
    }
}
export default {
    REGISTER,
    LOGIN,
    GET,
    VERFY
}