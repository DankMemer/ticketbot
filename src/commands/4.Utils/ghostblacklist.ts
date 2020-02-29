import { ICommand, CommandParams, CommandOutput } from '../Command';
import { MemerUser } from '../../lib/MiscTypes';

export default class GhostblacklistCommand implements ICommand {
  name = 'ghostblacklist';
  aliases = ['gbl'];
  help = '<id>';

  public async execute({ db: { r }, args }: CommandParams): Promise<CommandOutput> {
    const id = args[0];
    if (!id) {
      return 'Supply a user ID and try again';
    }

    const doc = await r.table('users').get(id).run() as MemerUser;
    if (!doc) {
      return `The user ID \`${id}\` doesn't use Memer or you gave me the wrong ID`;
    }
    if (doc.ghostBlacklist === 0) {
      return `The user ID \`${id}\` currently isn't ghostblacklisted.`;
    }

    await r.table('users').get(id).update({ ghostBlacklist: 0 }).run();
    return `Successfully un-ghostblacklisted \`${id}\`.`;
  }
}
