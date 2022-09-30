import model from './glassesModel.js';
import frameModel from '../frame/frameModel.js';
import lenseModel from '../lense/lenseModel.js';
import currencies from '../../../utils/currencies.js';
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
      .find({ status: "Active" })
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
  create: async (req, res, next) => {
    const newItem = req.body;
    //newItem.createdBy = req.user._id;

    const currency = req.query.currency;
    if(currencies.includes(currency) === -1) {
      res.status(400).send(`Invalid Currency ${currency}`);
      return;
    }

    // Look up the frame in the database
    frameModel.findById(newItem.frameId).then((frame) => {
      if(!frame) {
        next(new Error(`Cant find frame with ID ${newItem.frameId}`));
        return;
      }
      if(frame.stock < 1) {
        res.status(400).send(`Insufficient stock for frame ID ${newItem.frameId}`);
        return;
      }

      // Look up the lense in the database
      lenseModel.findById(newItem.lenseId).then((lense) => {
        if(!lense) {
          next(new Error(`Cant find lense with ID ${newItem.lenseId}`));
          return;
        }
        if(lense.stock < 1) {
          res.status(400).send(`Insufficient stock for lense ID ${newItem.lenseId}`);
          return;
        }
        
        newItem.price = {
          USD: frame.price.USD + lense.price.USD,
          GBP: frame.price.GBP + lense.price.GBP,
          EUR: frame.price.EUR + lense.price.EUR,
          JOD: frame.price.JOD + lense.price.JOD,
          JPY: frame.price.JPY + lense.price.JPY,
        }
        // Create a new glasses in the database
        model.create(newItem).then(async (item) => {
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
          const { _id, frameId, lenseId } = item;
          const price = item.price[currency];
          res.status(201).json({
              data: {
                _id,
                frameId,
                lenseId,
                price,
              } ,
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
