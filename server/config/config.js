import _ from 'lodash';
import logger from '../utils/logger.js';

const settings = {
  dev: 'development',
  test: 'testing',
  prod: 'production',
  // eslint-disable-next-line  no-undef
  port: process.env.PORT || 3000,
  // eslint-disable-next-line  no-undef
  expiryTime: process.env.EXPIRY_TIME || 24 * 60,
  secrets: {
    // eslint-disable-next-line  no-undef
    jwtSecret: process.env.JWT_SECRET || 'bloobloom',
  },
};

// eslint-disable-next-line  no-undef
process.env.NODE_ENV = process.env.NODE_ENV || settings.dev;
// eslint-disable-next-line  no-undef
settings.env = process.env.NODE_ENV;

let config;
try {
  config = await import(`./${settings.env}.js`);
} catch (error) {
  logger.error(`Error while reading config from file: ${error.message}`);
}
config = config.default || {};

export default _.merge(settings, config);
