import { ICommand, CommandOutput } from './Command';
import { musicHandler } from '../music';

export default class QueueCommand implements ICommand {
  name = 'queue';
  aliases = ['q'];

  public async execute(): Promise<CommandOutput> {
    const queue = musicHandler.state.songQueue;
    if (musicHandler.state.currentlyPlaying) {
      queue.unshift(musicHandler.state.currentlyPlaying);
    }
    if (queue.length === 0) {
      return 'The queue is empty.';
    }

    return {
      title: `Songs in queue (${queue.length})`,
      fields: queue.map((song, i) => ({
        name: `${i === 0 ? '__[Currently playing]__ ' : ''}${song.title}`,
        value: `[Queued by <@${song.queuedBy}>](${song.url})`
      })).slice(0, 25)
    };
  }
}
