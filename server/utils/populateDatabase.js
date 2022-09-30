import _ from 'lodash';
import frameModel from '../api/v1/frame/frameModel.js';
import lenseModel from '../api/v1/lense/lenseModel.js';
import adminModel from '../api/v1/admin/adminModel.js';
import logger from './logger.js';
import customTypes from './customTypes.js';

const admins = [
  {
    firstName: 'John',
    lastName: 'Doe',
    username: 'admin',
    password: 'admin',
  },
];

const frames = [
  {
    name: 'Frame dummy 1',
    description: 'Dummy description 1',
    status: customTypes.frameStatus.ACTIVE,
    stock: 10,
    price: {
      USD: 109.9,
      GBP: 89.9,
      EUR: 99.9,
      JOD: 69.9,
      JPY: 299.9,
    }
  },
  {
    name: 'Frame dummy 2',
    description: 'Dummy description 2',
    status: customTypes.frameStatus.INACTIVE,
    stock: 15,
    price: {
      USD: 129.9,
      GBP: 109.9,
      EUR: 119.9,
      JOD: 89.9,
      JPY: 319.9,
    }
  },
  {
    name: 'Frame dummy 3',
    description: 'Dummy description 3',
    status:customTypes.frameStatus.ACTIVE,
    stock: 15,
    price: {
      USD: 79.9,
      GBP: 59.9,
      EUR: 69.9,
      JOD: 49.9,
      JPY: 229.9,
    }
  },
  {
    name: 'Frame dummy 4',
    description: 'Dummy description 4',
    status: customTypes.frameStatus.INACTIVE,
    stock: 8,
    price: {
      USD: 209.9,
      GBP: 189.9,
      EUR: 199.9,
      JOD: 169.9,
      JPY: 499.9,
    }
  },
  {
    name: 'Frame dummy 5',
    description: 'Dummy description 5',
    status: customTypes.frameStatus.ACTIVE,
    stock: 30,
    price: {
      USD: 159.9,
      GBP: 139.9,
      EUR: 149.9,
      JOD: 119.9,
      JPY: 199.9,
    }
  },
];

const lenses = [
  {
    colour: 'blue',
    description: 'Dummy description 1',
    prescriptionType: customTypes.prescriptionType.FASHION,
    lenseType: customTypes.lenseType.CLASSIC,
    stock: 100,
    price: {
      USD: 39.9,
      GBP: 19.9,
      EUR: 29.9,
      JOD: 9.9,
      JPY: 59.9,
    }
  },
  {
    colour: 'brown',
    description: 'Dummy description 2',
    prescriptionType: customTypes.prescriptionType.SINGLE_VISION,
    lenseType: customTypes.lenseType.BLUE_LIGHT,
    stock: 200,
    price: {
      USD: 499.9,
      GBP: 479.9,
      EUR: 489.9,
      JOD: 359.9,
      JPY: 1099.9,
    }
  },
  {
    colour: 'green',
    description: 'Dummy description 3',
    prescriptionType: customTypes.prescriptionType.VARIFOCAL,
    lenseType: customTypes.lenseType.TRANSITION,
    stock: 300,
    price: {
      USD: 99.9,
      GBP: 79.9,
      EUR: 89.9,
      JOD: 69.9,
      JPY: 179.9,
    }
  },
  {
    colour: 'transparent',
    description: 'Dummy description 4',
    prescriptionType: customTypes.prescriptionType.SINGLE_VISION,
    lenseType: customTypes.lenseType.BLUE_LIGHT,
    stock: 33,
    price: {
      USD: 49.9,
      GBP: 29.9,
      EUR: 39.9,
      JOD: 19.9,
      JPY: 99.9,
    }
  },
  {
    colour: 'white',
    description: 'Dummy description 5',
    prescriptionType: customTypes.prescriptionType.FASHION,
    lenseType: customTypes.lenseType.CLASSIC,
    stock: 12,
    price: {
      USD: 259.9,
      GBP: 239.9,
      EUR: 249.9,
      JOD: 159.9,
      JPY: 699.9,
    }
  },
];

let adminUserId;

const createDoc = (model, doc) => {
  return new Promise((resolve, reject) => {
    new model(doc).save((err, saved) => {
      return err ? reject(err) : resolve(saved);
    });
  });
};

var cleanDatabase = () => {
  logger.info('Cleaning the database...');
  var cleanPromises = [adminModel, frameModel, lenseModel].map((model) => {
    return model.deleteMany().exec();
  });
  return Promise.all(cleanPromises);
};

const createAdmins = (data) => {
  const promises = admins.map((admin) => {
    return createDoc(adminModel, admin);
  });

  return Promise.all(promises).then((admins) => {
    adminUserId = admins[0]._id;
    return _.merge({ admins }, data || {});
  });
};

const createFrames = (data) => {
  const promises = frames.map((frame) => {
    frame.createdBy = adminUserId;
    return createDoc(frameModel, frame);
  });

  return Promise.all(promises).then((frames) => {
    return _.merge({ frames }, data || {});
  });
};

const createLenses = (data) => {
  const promises = lenses.map((lense) => {
    lense.createdBy = adminUserId;
    return createDoc(lenseModel, lense);
  });

  return Promise.all(promises).then((lenses) => {
    return _.merge({ lenses }, data || {});
  });
};

export default function populateDatabase() {
    logger.info('Populating the database with some items');
    cleanDatabase()
      .then(createAdmins)
      .then(createFrames)
      .then(createLenses)
      .then(() => {
        logger.info(`Populated the database with ${admins.length} Admins, ${frames.length} Frames and ${lenses.length} Lenses`);
      })
      .catch((error) => {
        logger.error(`Error while populating database: ${error.message}`);
    });
}
