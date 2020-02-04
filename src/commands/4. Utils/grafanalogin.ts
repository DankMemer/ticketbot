import { ICommand, CommandParams, CommandOutput } from '../Command';
import { Restricted, ChannelLock, ChannelLockTypes } from '../decorators';
import { config } from '../../';
import { randomBytes } from 'crypto';
import HTTP from '../../lib/http';
import { dateToString, codeblock } from '../../lib/util';
import { GrafanaAccount } from '../../Database/tables/GrafanaAccounts';

@ChannelLock(ChannelLockTypes.DIRECT_MESSAGES)
@Restricted({ roleIDs: [ config.roles.directors/*, config.roles.modManagers*/ ] })
export default class GrafanaLoginCommand implements ICommand {
  name = 'grafanalogin';
  aliases = ['gl'];
  help = 'grafanalogin <create | forgot> [username]';

  public async execute({ db, msg, args }: CommandParams): Promise<CommandOutput> {
    switch (args.shift()) {
      case 'create':
        return this.create({ db, msg, args });
      
      case 'forgot':
        return this.forgot({ db, msg });

      default:
        return `\`${this.help}\``;
    }
  }

  public async forgot({ db, msg }: Partial<CommandParams>): Promise<CommandOutput> {
    const account = await db.grafanaAccounts.getAccountByDiscordID(msg.author.id);
    if (!account) {
      return `This Discord account doesn't have a Grafana account.`; 
    }

    const password = randomBytes(16).toString('hex');
    const { ok, body } = await HTTP.put(`${config.metrics.grafanaURL}/api/admin/users/${account._id}/password`)
      .addHeader('Content-Type', 'application/json')
      .addHeader('Authorization', `Basic ${config.keys.grafana}`)
      .send({ password })
      .catch(e => e);

    if (!ok) {
      return `Something went wrong on our end:\n${codeblock(JSON.stringify(body, null, 2), 'json')}`;
    }

    await HTTP.post(`${config.metrics.grafanaURL}/api/admin/users/${account._id}/logout`)
      .addHeader('Authorization', `Basic ${config.keys.grafana}`);

    return {
      title: 'Successfully regenerated password',
      fields: [
        { name: 'Username', value: account.username },
        { name: 'New Password', value: `||${password}||` }
      ],
    };
  }

  public async create({ db, msg, args }: Partial<CommandParams>): Promise<CommandOutput> {
    if (args.length > 1) {
      return 'Username cannot contain spaces.';
    }

    const username = args[0];
    if (!username || username.length === 0) {
      return `Missing username parameter:\n\`${this.help}\``;
    }
    if (!(/^[A-z0-9]*$/).test(username)) {
      return 'Invalid username format; only Latin characters allowed'
    }
    if (await db.grafanaAccounts.getAccountByUsername(username)) {
      return `Account with username \`${username}\` already exists.`;
    }
    const existingDiscordAccount = await db.grafanaAccounts.getAccountByDiscordID(msg.author.id);
    if (existingDiscordAccount) {
      return `This Discord account already has a Grafana account (username: \`${existingDiscordAccount.username}\`, created @ ${dateToString(existingDiscordAccount.createdAt)})`
    }

    const password = randomBytes(16).toString('hex');
    const { body, ok } = await HTTP.post(`${config.metrics.grafanaURL}/api/admin/users`)
      .addHeader('Content-Type', 'application/json')
      .addHeader('Authorization', `Basic ${config.keys.grafana}`)
      .send({
        name: `${msg.author.username}#${msg.author.discriminator}`,
        login: username,
        password
      })
      .catch(e => e);

    if (!ok) {
      return `Something went wrong on our end:\n${codeblock(JSON.stringify(body, null, 2), 'json')}`;
    }

    const grafanaAccount: GrafanaAccount = {
      _id: body.id,
      discordID: msg.author.id,
      username,
      createdAt: new Date(),
    };
    await db.grafanaAccounts.createAccount(grafanaAccount);

    return {
      title: 'Successfully created account',
      description: `Log in at ${config.metrics.grafanaURL}`,
      fields: [
        { name: 'Username', value: username },
        { name: 'Password', value: `||${password}||` }
      ]
    };
  }
}
