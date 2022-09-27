import model from './frameModel.js';
import _ from 'lodash';

export default {
  params: (req, res, next, id) => {
    model.findById(id).then(
      (item) => {
        if (!item) {
          next(new Error('No frame with that id'));
        } else {
          req.frame = item;
          next();
        }
      },
      (err) => {
        next(err);
      }
    );
  },
  get: (req, res, next) => {
    model.find({}).then(
      function (items) {
        res.json(items);
      },
      function (err) {
        next(err);
      }
    );
  },
  getOne: (req, res) => {
    res.json(req.frame);
  },
  create: (req, res, next) => {
    const newItem = req.body;

    model.create(newItem).then(
      function (item) {
        res.json(item);
      },
      function (err) {
        console.error(err);
        next(err);
      }
    );
  },
  update: (req, res, next) => {
    const frame = req.frame;

    var newItem = req.body;

    _.merge(frame, newItem);

    model.save(function (err, saved) {
      if (err) {
        next(err);
      } else {
        res.json(saved);
      }
    });
  },
  delete: (req, res, next) => {
    req.frame.remove((err, removed) => {
      if (err) {
        next(err);
      } else {
        res.json(removed);
      }
    });
  },
};
