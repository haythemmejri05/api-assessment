import _ from 'lodash';
import model from './frameModel.js';
import customTypes from '../../../utils/customTypes.js';

export default {
  params: (req, res, next, id) => {
    model.findById(id)
    .populate('createdBy', 'username')
    .exec()
    .then(
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
  getActive: (req, res, next) => {
    model.find({ status: customTypes.frameStatus.ACTIVE })
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
        data: req.frame,
        error: null
    });
  },
  create: (req, res, next) => {
    const newItem = req.body;
    newItem.createdBy = req.auth._id;

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
    const frame = req.frame;

    var newItem = req.body;

    _.merge(frame, newItem);

    frame.save((err, saved) => {
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
    req.frame.remove((err, removed) => {
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
