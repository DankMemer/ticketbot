import { ICommand, CommandParams, CommandOutput } from '../Command';

const friendlyMessages: { [k: number]: string } = {
  1: 'direct messages',
};
export enum ChannelLockTypes {
  DIRECT_MESSAGES = 1,
};

export const ChannelLock = (channelType: ChannelLockTypes) =>
  <T extends new (...args: any[]) => any>(Target: T) => {
    return class extends Target implements Partial<ICommand> {
      public execute({ msg, ...rest }: CommandParams): CommandOutput {
        if (msg.channel.type !== channelType) {
          return `You can only run this command in ${friendlyMessages[channelType]}.`;
        }

        return super.execute({ msg, ...rest });
      }
    }
  };
