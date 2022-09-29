import jwt from 'jsonwebtoken';
import { expressjwt } from "express-jwt";
import config from '../config/config.js';
import userModel from '../api/v1/user/userModel.js';

export default {
    decodeToken: () => {
        return function (req, res, next) {
            console.log("oifoidsfosd");
            // eslint-disable-next-line  no-prototype-builtins
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = 'Bearer ' + req.query.access_token;
                console.log("ooooo");
            }
            console.log(req.headers.authorization);
            const checkToken = expressjwt({ 
                secret: config.secrets.jwtSecret,
                algorithms: ["HS256"],
            });
            checkToken(req, res, next);
        }
    },
    getCaller: () => {
        return function (req, res, next) {
            userModel.findById(req.auth._id).then((user) => {
                if(!user) {
                    res.status(401).send('Unauthorized');
                    return;
                }
                req.user = user;
                next();
            }, (err) => {
                next(err);
            });
        }
    },
    checkAdminRole: () => {
        return function (req, res, next) {
            if(req.user.role !== 'admin') {
                res.status(401).send('Unauthorized (user role mismatch)');
                    return;
            } 
            next();
        }
    },
    checkUserRole: () => {
        return function (req, res, next) {
            if(req.user.role !== 'user') {
                res.status(401).send('Unauthorized (user role mismatch)');
                    return;
            } 
            next();
        }
    },
    authenticateUser: () => {
        return function (req, res, next) {
            console.log(req.body);
            const username = req.body.username;
            const password = req.body.password;

            if(!username || !password) {
                res.status(400).send('Bad request: you need to specify username and password');
                return;
            }

            userModel.findOne({ username }).then((user) => {
                if(!user) {
                    res.status(401).send('Invalid username');
                    return;
                } else {
                    if(!user.authenticate(password)) {
                        res.status(401).send('Invalid password');
                        return;
                    }
                    req.user = user;
                    next();
                }
            }, (err) => {
                next(err);
            })
        }
    },
    signToken: (id) => {
        return jwt.sign(
            { 
                _id: id 
            },
            config.secrets.jwtSecret,
            { 
                expiresIn: config.expiryTime 
            });
    },
};