import notifier from '../../includes/micro-notifier.js';
import loggerFactory from '../../../core/factory/logger';

const logger = loggerFactory('core', { message_prefix: 'user event created' });

module.exports = function ({ user, validationUrl = '' } = {}) {
  setImmediate(() => {
    // Build url
    if (validationUrl) {
      Object.keys(user.toObject()).forEach((property) => validationUrl = validationUrl.replace(`{{user.${property}}}`, user[property]));
    }

    // Trigger notification
    const event = 'users:created';
    const data = {
      user: user.toObject(),
      validationUrl,
    };
    notifier.triggerNotification({ event, data })
      .catch((err) => {
        if (err.isError && err.isError() && err.getError().code === 501) {
          logger.verbose(`Event "${event}" not implemented`);
        } else {
          logger.error(`Error while triggering notification: ${err.message || err}`);
          logger.error(err);
        }
      });
  });
};
