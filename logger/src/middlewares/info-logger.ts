import { NextFunction, Request, Response } from "express";
import { currentUser } from '@unifycaredigital/aem';

var fs = require('fs');
var path = require('path');


var winston = require('winston');
var expressWinston = require('express-winston');
//require('winston-mongodb').MongoDB;

declare global {
    namespace Express {
        interface Request {
            errorlog(message: any): any;
            warnlog(message: any): any;
            infolog(message: any): any;
            debuglog(message: any): any;
        }
    }
}
var logDir = 'logs'; // directory path you want to set
if (!fs.existsSync(logDir)) {
    // Create the directory if it does not exist
    fs.mkdirSync(logDir);
}

const loggerOption = {
    statusLevels: false,// default value
    level: function (req: Request, res: Response) {
        var level = "";
        if (res.statusCode >= 100) { level = "info"; }
        if (res.statusCode >= 400) { level = "error"; }
        if (res.statusCode >= 500) { level = "error"; }
        // Ops is worried about hacking attempts so make Unauthorized and Forbidden critical
        if (res.statusCode == 401 || res.statusCode == 403) { level = "error"; }
        // No one should be using the old path, so always warn for those
        //if (req.path === "/v1" && level === "info") { level = "warn"; }
        return level;
    },
    transports: [
        new winston.transports.Console({
            level: process.env.CONSOLE_LOG_LEVEL ? process.env.CONSOLE_LOG_LEVEL : 'info'
        }),
        // new winston.transports.File({
        //     name: 'mainlog',
        //     level: process.env.FILE_LOG_LEVEL ? process.env.FILE_LOG_LEVEL : 'info',
        //     handleExceptions: true,
        //     timestamp: true,
        //     filename: path.join(logDir, process.env.FILE_LOG_NAME ? process.env.FILE_LOG_NAME : '/commonLogger'),
        //     maxsize: 10485760,
        //     maxFiles: 10,
        //     datePattern: '.yyyy-MM-dd'
        // })
        // new winston.transports.MongoDB({
        //     db: process.env.MONGO_LOG_URI ? process.env.MONGO_LOG_URI : 'mongodb://logger-mongo-srv:27017/common',
        //     options: { strict: false, poolSize: 2, useNewUrlParser: true, useUnifiedTopology: true },
        //     level: process.env.MONGO_LOG_LEVEL ? process.env.MONGO_LOG_LEVEL : 'info',
        //     collection: process.env.MONGO_LOG_COLLECTION ? process.env.MONGO_LOG_COLLECTION : 'log',
        //     capped: true,
        //     decolorize: true,
        //     tryReconnect: true,
        // }),
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.json()
    ),
    dynamicMeta: (req: Request, res: Response) => {

        return {
            requestMethod: req.method,
            requestUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
            protocol: `HTTP/${req.httpVersion}`,
            remoteIp: req.ip.indexOf(':') >= 0 ? req.ip.substring(req.ip.lastIndexOf(':') + 1) : req.ip,  // just ipv4
            requestSize: req.socket.bytesRead,
            reqBody: req.body,
            userAgent: req.get('User-Agent'),
            referrer: req.get('Referrer'),
            userId: req.currentUser ? req.currentUser.id : null,
            userType: req.currentUser ? req.currentUser.uty : null,
            userStatus: req.currentUser ? req.currentUser.ust : null,
            userAccessLevel: req.currentUser ? req.currentUser.alv : null,
            userEntityId: req.currentUser ? req.currentUser.fid : null,
            resStatus: res.statusCode,
            resStatusMessage: res.statusMessage,
        }
    }
};

const logger = winston.createLogger(loggerOption);
export const winstonMiddleware = expressWinston.logger(loggerOption);

export const loggerMiddleware = function (req: Request, res: Response, next: NextFunction) {
    var meta = { 'meta': { 'req': { 'headers': { "x-request-id": req.headers['x-request-id'] } } } };
    req.errorlog = function (message: any) {
        logger.log('error', message, meta);
    };
    req.warnlog = function (message: any) {
        logger.log('warn', message, meta);
    };
    req.infolog = function (message: any) {
        logger.log('info', message, meta);
    };
    req.debuglog = function (message: any) {
        logger.log('debug', message, meta);
    };

    next();
}


