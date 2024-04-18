export class VolidationError extends Error{
    constructor(status,message){
        super()
        this.name = "VolidationError"
        this.message = message 
        this.status = status
    }
}

export class InternalServerError extends Error{
    constructor(status,message){
        super()
        this.name = "InternalServerError"
        this.message = message 
        this.status = status
    }
}

export class AuthorizationError extends Error{
    constructor(status,message){
        super()
        this.name = "AuthorizationError"
        this.message = message 
        this.status = status
    }
}