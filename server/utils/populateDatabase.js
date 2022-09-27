import _ from 'lodash';
import frameModel from '../api/v1/frame/frameModel.js';
import lenseModel from '../api/v1/lense/lenseModel.js';
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

const lenses = [
  {
    colour: 'blue',
    description: 'Dummy description 1',
    prescriptionType: 'fashion',
    lenseType: 'classic',
    stock: 100,
    price: 39.9,
  },
  {
    colour: 'brown',
    description: 'Dummy description 2',
    prescriptionType: 'single_vision',
    lenseType: 'blue_light',
    stock: 200,
    price: 59.9,
  },
  {
    colour: 'green',
    description: 'Dummy description 3',
    prescriptionType: 'varifocal',
    lenseType: 'transition',
    stock: 300,
    price: 79.9,
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
  var cleanPromises = [frameModel, lenseModel].map((model) => {
    return model.deleteMany().exec();
  });
  return Promise.all(cleanPromises);
};

const createFrames = (data) => {
  const promises = frames.map((frame) => {
    return createDoc(frameModel, frame);
  });

  return Promise.all(promises).then((frames) => {
    return _.merge({ frames }, data || {});
  });
};

const createLenses = (data) => {
  const promises = lenses.map((lense) => {
    return createDoc(lenseModel, lense);
  });

  return Promise.all(promises).then((lenses) => {
    return _.merge({ lenses }, data || {});
  });
};

export default function populateDatabase() {
    logger.info('Populating the database with some items');
    cleanDatabase()
        .then(createFrames)
        .then(createLenses)
        .then(() => {
            logger.info(`Populated the database with ${frames.length} Frames and ${lenses.length} Lenses`);
        })
        .catch((error) => {
            logger.error(`Error while populating database: ${error.message}`);
    });
}
