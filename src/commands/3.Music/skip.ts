import { ICommand, CommandParams, CommandOutput } from '../Command';
import { musicHandler } from '../../music';

export default class SkipCommand implements ICommand {
  name = 'skip';
  aliases = ['next'];

  public async execute({ msg, client }: CommandParams): Promise<CommandOutput> {
    if (!musicHandler.state.currentlyPlaying) {
      return 'Currently not playing anything; nothing to skip';
    }

    if (!msg.member.voiceState) {
      return 'Join the voice channel to skip something';
    }

    const player = client.voiceConnections.get((msg.channel as any).guild.id);
    await musicHandler.consume(client, player);
    return 'Skipped';
  }
}
