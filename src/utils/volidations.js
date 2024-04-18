import Joi from "joi"

export const registerSchema = Joi.object({
    userName: Joi.string().min(3).max(30).alphanum().required(),
    password:Joi.string().min(8).required()
})

export const loginSchema = Joi.object({
    userName: Joi.string().min(3).max(30).alphanum().required(),
    password:Joi.string().min(8).required()
})

export const fileSchema = Joi.object({
    title: Joi.string().min(3).max(30).alphanum().required(),
    userId: Joi.number().required()
})
