import { ICommand, CommandParams, CommandOutput } from '../Command';

export const Restricted = ({ roleIDs = [], userIDs = [] }: {
  roleIDs?: string[];
  userIDs?: string[];
}) =>
  <T extends new (...args: any[]) => any>(Target: T) => {
    return class extends Target implements Partial<ICommand> {
      public execute({ msg, ...rest }: CommandParams): CommandOutput {
        if (roleIDs.length === 0 && userIDs.length === 0) {
          throw new Error("Expected at least one filter parameter");
        }

        if (
          !userIDs.includes(msg.author.id) &&
          !(msg.member && msg.member.roles.some(roleID => roleIDs.includes(roleID)))
        ) {
          return {
            title: 'Unauthorized to run command',
            description: `This command is locked to the following entities:\n\n${
              userIDs.map(userID => `- <@${userID}> (user)`)
                .concat(
                  roleIDs.map(roleID => `- <@&${roleID}> (role)`)
                )
                .join('\n')
            }`
          };
        }

        return super.execute({ msg, ...rest });
      }
    }
  };
