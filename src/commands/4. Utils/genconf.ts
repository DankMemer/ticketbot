import { ICommand, CommandParams, CommandOutput } from '../Command';
import { Restricted } from '../decorators';
import { config } from '../../';
import { promises as fs } from 'fs';
import { GuildChannel } from 'eris';
import { parse, stringify } from 'yaml';

type PrometheusConfig = {
  global: {
    scrape_interval: string;
  };
  scrape_configs: Array<{
    job_name: string;
    scrape_interval: string;
    static_configs: Array<{
      targets: string[];
    }>;
    metric_relabel_configs: Array<{
      source_labels: string[];
      regex: string;
      target_label: string;
      replacement: string;
    }>;
  }>;
};

@Restricted({ userIDs: config.owners })
export default class GrafanaLoginCommand implements ICommand {
  name = 'genconf';
  private currentConfigRaw: string;

  public async onLoad(): Promise<void> {
    this.currentConfigRaw = await fs.readFile('/etc/prometheus/prometheus.yml', 'utf8');
  }

  public async execute({ msg }: CommandParams): Promise<CommandOutput> {
    const currentConfig: PrometheusConfig = parse(this.currentConfigRaw);
    const relabelConfigs = currentConfig.scrape_configs[0].metric_relabel_configs;

    const guild = (msg.channel as GuildChannel).guild;
    const members = guild.members.filter(m => m.roles.includes(config.roles.mods));
    const channels = guild.channels.filter(c => c.type === 0);

    for (const relabel of relabelConfigs) {
      if (
        !members.find(m => m.id === relabel.regex) &&
        !channels.find(c => c.id === relabel.regex)
      ) {
        relabelConfigs.splice(relabelConfigs.indexOf(relabel), 1);
      }
    }

    for (const member of members) {
      if (!relabelConfigs.find(relabel => relabel.regex === member.id)) {
        relabelConfigs.push({
          source_labels: ['author_id'],
          regex: member.id,
          target_label: 'user_name',
          replacement: member.nick || member.username,
        });
      }
    }
    
    for (const channel of channels) {
      if (!relabelConfigs.find(relabel => relabel.regex === channel.id)) {
        relabelConfigs.push({
          replacement: channel.name,
          source_labels: ['channel_id'],
          regex: channel.id,
          target_label: 'channel_name',
        });
      }
    }

    relabelConfigs.sort((a, b) => a.source_labels[0].localeCompare(b.source_labels[0]));

    await msg.channel.createMessage('', {
      name: 'prometheus.yml',
      file: stringify(currentConfig)
    });
    return null;
  }
}
