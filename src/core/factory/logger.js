/*
 * Expose a function to get logger based on config, with specific options
 *
 * @usage:
 * ```
 * const loggerFactory = require('logger');
 * const myLogger = loggerFactory('core', {...});
 * ```
 */
import config from '../../app/config/server';
import { application } from '../../app/config/parameters';
import { LoggerFactory } from 'nippy-core-lib';
import { ConfigurationError } from '../errors';

const loggerFactory = new LoggerFactory();
loggerFactory.config.setLoggers(config.logs.loggers);
loggerFactory.config.setTransporters(config.logs.transporters);
loggerFactory.setErrorClass(ConfigurationError);

let cache = {};

module.exports = (loggerId, overrideOptions = {}, defaultMetas = {}) => {
  const cacheId = loggerId + JSON.stringify(overrideOptions) + JSON.stringify(defaultMetas);
  if (!cache[cacheId]) {
    cache[cacheId] = loggerFactory.get(loggerId, overrideOptions);
    if (Object.keys(defaultMetas).length > 0) {
      const coreMetas = {
        app: application.name,
        logger: loggerId,
        user: null,
      };
      cache[cacheId].rewriters.push((level, msg, meta = {}) => {
        Object.assign(meta, defaultMetas, coreMetas);
        return meta;
      });
    }
  }
  return cache[cacheId];
};
