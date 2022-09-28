import model from './lenseModel.js';
import _ from 'lodash';

export default {
  params: (req, res, next, id) => {
    model.findById(id)
    .populate('createdBy', 'username')
    .exec()
    .then(
      (item) => {
        if (!item) {
          next(new Error('No lense with that id'));
        } else {
          req.lense = item;
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
    .populate('createdBy', 'username')
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
        data: req.lense,
        error: null
    });
  },
  create: (req, res, next) => {
    const newItem = req.body;
    newItem.createdBy = req.user._id;

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
    const lense = req.lense;

    var newItem = req.body;

    _.merge(lense, newItem);

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
    req.lense.remove((err, removed) => {
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
};
