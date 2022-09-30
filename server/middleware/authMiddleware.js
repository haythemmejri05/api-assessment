import jwt from 'jsonwebtoken';
import { expressjwt } from "express-jwt";
import config from '../config/config.js';
import adminModel from '../api/v1/admin/adminModel.js';

export default {
    decodeToken: () => {
        return function (req, res, next) {
            // eslint-disable-next-line  no-prototype-builtins
            if (req.query && req.query.hasOwnProperty('access_token')) {
                req.headers.authorization = 'Bearer ' + req.query.access_token;
            }
            const checkToken = expressjwt({ 
                secret: config.secrets.jwtSecret,
                algorithms: ["HS256"],
            });
            checkToken(req, res, next);
        }
    },
    getCaller: () => {
        return function (req, res, next) {
            adminModel.findById(req.auth._id).then((admin) => {
                if(!admin) {
                    res.status(401).send('Unauthorized');
                    return;
                }
                req.admin = admin;
                next();
            }, (err) => {
                next(err);
            });
        }
    },
    authenticateAdmin: () => {
        return function (req, res, next) {
            const username = req.body.username;
            const password = req.body.password;

            if(!username || !password) {
                res.status(400).send('Bad request: you need to specify username and password');
                return;
            }

            adminModel.findOne({ username }).then((admin) => {
                if(!admin) {
                    res.status(401).send('Invalid username');
                    return;
                } else {
                    if(!admin.authenticate(password)) {
                        res.status(401).send('Invalid password');
                        return;
                    }
                    req.admin = admin;
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