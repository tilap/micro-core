import Client from './micro-notifier-client-1.0.0.js';
import { clients } from '../config/env';

class Api extends Client {
  constructor() {
    super({ endpoint: clients.notifier.url, token: clients.notifier.token });
  }
}

module.exports = new Api();
