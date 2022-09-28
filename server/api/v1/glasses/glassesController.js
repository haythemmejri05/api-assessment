import model from './glassesModel.js';
import frameModel from '../frame/frameModel.js';
import lenseModel from '../lense/lenseModel.js';
//import _ from 'lodash';

export default {
  params: (req, res, next, id) => {
    model
      .findById(id)
      .populate('createdBy', 'username')
      .populate('frameId lenseId')
      .exec()
      .then(
        (item) => {
          if (!item) {
            next(new Error('No glasses with that id'));
          } else {
            req.glasses = item;
            next();
          }
        },
        (err) => {
          next(err);
        }
      );
  },
  get: (req, res, next) => {
    model
      .find({})
      .populate('createdBy', 'username')
      .populate('frameId lenseId')
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
      data: req.glasses,
      error: null,
    });
  },
  create: (req, res, next) => {
    const newItem = req.body;
    newItem.createdBy = req.user._id;

    // Look up the frame in the database
    frameModel.findById(newItem.frameId).then((frame) => {
      if(!frame) {
        next(new Error(`Cant find frame with ID ${newItem.frameId}`));
        return;
      }
      // Look up the lense in the database
      lenseModel.findById(newItem.lenseId).then((lense) => {
        if(!lense) {
          next(new Error(`Cant find lense with ID ${newItem.lenseId}`));
          return;
        }
        // Create a new glasses in the database
        model.create(newItem).then((item) => {
          // Decrement the frame's stock number
          frame.stock -= 1;
          frameModel.save((err) => {
              if (err) {
                next(err);
                return;
              }
          });
          // Decrement the lense's stock number
          lense.stock -= 1;
          lenseModel.save((err) => {
              if (err) {
                next(err);
                return;
              }
          });
          // Return saved item
          res.status(201).json({
              data: item,
              error: null,
          });
        }, (err) => {
          next(err);
        });
      }, (err) => {
        next(err);
      });
    }, (err) => {
      next(err);
    });
  },
  /*update: (req, res, next) => {
    const glasses = req.glasses;

    var newItem = req.body;

    _.merge(glasses, newItem);

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
  },*/
  delete: (req, res, next) => {
    // Look up the frame in the database
    frameModel.findById(req.glasses.frameId).then((frame) => {
      if(!frame) {
        next(new Error(`Cant find frame with ID ${req.glasses.frameId}`));
        return;
      }
      // Look up the lense in the database
      lenseModel.findById(req.glasses.lenseId).then((lense) => {
        if(!lense) {
          next(new Error(`Cant find lense with ID ${req.glasses.lenseId}`));
          return;
        }
        // Remove glasses from the database
        req.glasses.remove((err, removed) => {
          if (err) {
            next(err);
          } else {
            res.json({
              data: removed,
              error: null,
            });
          }
        });
      }, (err) => {
        next(err);
      });
    }, (err) => {
      next(err);
    });
  },
};
