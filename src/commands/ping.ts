import { Command, CommandParams, CommandOutput } from './Command';

export default class PingCommand implements Command {
  name = 'ping';
  execute = ({ client }: CommandParams): CommandOutput =>
    `ponge ${client.shards.get(0).latency}ms`;
}
