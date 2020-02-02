import Event from './Event';
import { PlayerManager } from 'eris-lavalink';
import { register } from 'prom-client';
import { createServer } from 'http';

export const onceReady: Event = {
  packetName: 'ready',
  once: true,
  handler() {
    if (this.opts.music && !(this.voiceConnections instanceof PlayerManager)) {
      this.voiceConnections = new PlayerManager(this, [{
        host: 'localhost', port: 2333, region: 'eu', password: this.opts.keys.lavalink
      }], {
        numShards: 1,
        userId: this.user.id
      });
    }

    createServer((_, res) => {
      res.writeHead(200, { 'Content-Type': register.contentType });
      res.end(register.metrics());
    }).listen(8081);
  }
};
