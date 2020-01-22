import { ICommand, CommandParams, CommandOutput } from './Command';
import { musicHandler, QueueResults } from '../music';
import { getOrdinal } from '../lib/util';

export default class PlayCommand implements ICommand {
  name = 'play';
  help = '<URL>';

  public async execute({ msg, args, client }: CommandParams): Promise<CommandOutput> {
    const url = args.join(' ');
    const res = await musicHandler.playOrQueue(url, client, msg);

    switch (res.status) {
      case QueueResults.NOT_FOUND:
        return `Couldn't find a song with query \`${url}\``;

      case QueueResults.NOT_IN_CHANNEL:
        return `Join a voice channel to queue something`;

      case QueueResults.PLAYING:
        return {
          title: 'Now Playing',
          url: res.song.url,
          description: res.song.title,
          thumbnail: { url: res.song.thumbnail }
        };

      case QueueResults.QUEUED:
        return {
          title: 'Now Queued',
          url: res.song.url,
          description: res.song.title,
          thumbnail: { url: res.song.thumbnail },
          footer: { text: `${getOrdinal(res.position)} in queue` }
        };
    }
  }
}
