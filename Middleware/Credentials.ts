// @ts-nocheck 
import { NextFunction, Request, Response } from "express";

const allowedOrigins = require('../config/allowedOrigins');

const Credentials = (req:Request, res:Response, next:NextFunction) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials','true');
    }
    next();
}

module.exports = Credentials;