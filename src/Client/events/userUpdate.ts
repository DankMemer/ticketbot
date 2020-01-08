import Event from './Event';
import { User } from 'eris';
import { findBad } from '../../util';
import { badUserWarning } from '../../dispatchers';

export const onUserUpdate: Event = {
  packetName: 'userUpdate',
  async handler(user: User) {
    const badWord: string | null = findBad(user.username);
    if (badWord) {
      badUserWarning.call(this, {
        user,
        badWord,
        propertyName: 'username',
        propertyValue: user.username,
      });
    }
  }
}