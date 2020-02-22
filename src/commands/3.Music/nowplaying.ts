import { ICommand, CommandOutput } from '../Command';
import { musicHandler } from '../../music';

export default class NowPlayingCommand implements ICommand {
  name = 'nowplaying';
  aliases = ['np'];

  public async execute(): Promise<CommandOutput> {
    const { currentlyPlaying } = musicHandler.state;
    if (!currentlyPlaying) {
      return 'Currently not playing anything.';
    }

    return {
      title: currentlyPlaying.title,
      url: currentlyPlaying.url,
      description: `Queued by <@${currentlyPlaying.queuedBy}>`,
      thumbnail: { url: currentlyPlaying.thumbnail },
    };
  }
}
