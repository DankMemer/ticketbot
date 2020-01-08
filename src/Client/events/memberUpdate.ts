import Event from './Event';
import { Guild, Member } from 'eris';
import { findBad } from '../../util';
import { badUserWarning } from '../../dispatchers';

export const onMemberUpdate: Event = {
  packetName: 'guildMemberUpdate',
  async handler(guild: Guild, member: Member) {
    const badWord: string | null = member.nick && findBad(member.nick);
    if (badWord) {
      badUserWarning.call(this, {
        user: member,
        propertyName: 'nickname',
        propertyValue: member.nick,
        badWord: badWord,
      });
    }
  }
}