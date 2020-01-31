import Event from './Event';
import { PlayerManager } from 'eris-lavalink';

export const onceReady: Event = {
  packetName: 'ready',
  handler() {
    if (!(this.voiceConnections instanceof PlayerManager)) {
      this.voiceConnections = new PlayerManager(this, [{
        host: 'localhost', port: 2333, region: 'eu', password: this.opts.keys.lavalink
      }], {
        numShards: 1,
        userId: this.user.id
      });
    }
  }
};
