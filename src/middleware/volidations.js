import { loginSchema, registerSchema, fileSchema} from "../utils/volidations.js";
import { VolidationError } from "../utils/error.js";

export default (req,res,next) =>{
    try {
    
        if(req.url == "/api/register" && req.method == "POST"){
            const {error} = registerSchema.validate(req.body)
    
            if(error) throw error
        }
        if(req.url == "/api/login" && req.method == "POST"){
            const {error} = loginSchema.validate(req.body)
            if(error) throw error
        }

        if(req.url == "/api/files" && req.method == "POST"){
            const { error } = fileSchema.validate(req.body)
            if(error) throw error
        }

        return next()
    } catch (error) {
        return next(new VolidationError(400,error.message))
    }
}