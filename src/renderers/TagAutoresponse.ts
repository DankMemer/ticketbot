import Renderer from './Renderer';
import { User } from 'eris';

const support = '<#491466924799164426>';
const botCommands = [
  '<#529532029197352960>',
  '<#574801447733035009>'
];

export const TagAutoresponseRenderer: Renderer = {
  render: (user: User) => ({
    title: 'Your message was deleted.',
    description: `${user.username}, you can use that command in ${botCommands[0]} or ${botCommands[1]}. Run \`-tags\` for a full list of our information commands. If you have any further questions, be sure to ask in ${support}.`
  })
};
