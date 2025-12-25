

import jwt from "jsonwebtoken"

const secret = process.env.JWT_SECRET!
if(!secret){
    console.error("There is no jwt secret in env vars")
    process.exit(1)
}

export const sign = (body: any)=>{
    return jwt.sign(body, secret)
}

export const decode = (token: string)=>{
    console.log("Secret", secret)
    return jwt.verify(token, secret)
}