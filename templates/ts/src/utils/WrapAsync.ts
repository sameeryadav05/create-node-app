import { Request, Response, NextFunction } from "express";

const WrapAsync = (fn:Function)=>{
    return function(req:Request,res:Response,next:NextFunction){
        Promise.resolve(fn(req,res,next)).catch(next)
    }
}

export default WrapAsync;