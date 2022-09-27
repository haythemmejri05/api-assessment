import _ from 'lodash';
import frameModel from '../api/v1/frame/frameModel.js';
import logger from './logger.js';

const frames = [
  {
    name: 'Frame dummy 1',
    description: 'Dummy description 1',
    status: 'Active',
    stock: 10,
    price: 99.9,
  },
  {
    name: 'Frame dummy 2',
    description: 'Dummy description 2',
    status: 'Inactive',
    stock: 15,
    price: 49.9,
  },
  {
    name: 'Frame dummy 3',
    description: 'Dummy description 3',
    status: 'Active',
    stock: 15,
    price: 69.9,
  },
];

const createDoc = (model, doc) => {
  return new Promise((resolve, reject) => {
    new model(doc).save((err, saved) => {
      return err ? reject(err) : resolve(saved);
    });
  });
};

var cleanDatabase = () => {
  logger.info('Cleaning the database...');
  var cleanPromises = [frameModel].map((model) => {
    return model.deleteMany().exec();
  });
  return Promise.all(cleanPromises);
};

var createFrames = (data) => {
  var promises = frames.map((frame) => {
    return createDoc(frameModel, frame);
  });

  return Promise.all(promises).then((frames) => {
    return _.merge({ frames: frames }, data || {});
  });
};

export default function populateDatabase() {
    logger.info('Populating the database with some items');
    cleanDatabase()
        .then(createFrames)
        .then(() => {
            logger.info('Populated the database with 3 Frames');
        })
        .catch((error) => {
            logger.error(`Error while populating database: ${error.message}`);
    });
}
