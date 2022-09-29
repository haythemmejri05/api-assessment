import _ from 'lodash';
import model from './userModel.js';
import authMiddleware from '../../../middleware/authMiddleware.js';

const signToken = authMiddleware.signToken;

export default {
  params: (req, res, next, id) => {
    model.findById(id)
    .select('-password')
    .exec()
    .then(
      (item) => {
        if (!item) {
          next(new Error('No user with that id'));
        } else {
          req.user = item;
          next();
        }
      },
      (err) => {
        next(err);
      }
    );
  },
  get: (req, res, next) => {
    model.find({})
    .select('-password')
    .exec()
    .then(
      (items) => {
        res.json({
        data: items,
        error: null,
      });
      },
      (err) => {
        next(err);
      }
    );
  },
  getOne: (req, res) => {
    res.json({
        data: req.user,
        error: null
    });
  },
  create: (req, res, next) => {
    const newItem = req.body;

    model.create(newItem).then(
      (item) => {
        res.status(201).json({
            data: item,
            error: null,
        });
      },
      (err) => {
        next(err);
      }
    );
  },
  update: (req, res, next) => {
    const user = req.user;

    var newItem = req.body;

    _.merge(user, newItem);

    model.save((err, saved) => {
      if (err) {
        next(err);
      } else {
        res.json({
            data: saved,
            error: null,
        });
      }
    });
  },
  delete: (req, res, next) => {
    req.user.remove((err, removed) => {
      if (err) {
        next(err);
      } else {
        res.json({
            data: removed,
            error: null,
        });
      }
    });
  },
  signIn: (req, res) => {
    const userToken = signToken(req.user._id);
    res.json({ token: userToken });
  },
};
