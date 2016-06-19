import notifier from '../../includes/micro-notifier.js';
import loggerFactory from '../../../core/factory/logger';

const logger = loggerFactory('core', { message_prefix: 'user event created' });

module.exports = function (user) {
  const event = 'users:validated';
  notifier.triggerNotification({ event, user: user.toObject() })
    .catch((err) => {
      if (err.isError && err.isError() && err.getError().code === 501) {
        logger.verbose('Event "%s" not implemented', event);
      } else {
        logger.error(`Error while triggering notification: ${err.message || err}`);
        logger.error(err);
      }
    });
};
