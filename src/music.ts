import { Message, VoiceConnection, GuildChannel } from 'eris';
import TicketBot from './Client';
import HTTP from './lib/http';

export type Song = {
  url: string;
  trackID: string;
  title: string;
  queuedBy: string;
  thumbnail: string;
};

export enum QueueResults {
  QUEUED,
  PLAYING,
  NOT_FOUND,
  NOT_IN_CHANNEL
}

export type QueueResult = Partial<{
  status: QueueResults;
  song: Song;
  position: number;
}>;

export const musicHandler = {
  state: {
    songQueue: [],
    repeat: false,
    currentlyPlaying: null
  } as {
    songQueue: Song[];
    repeat: boolean;
    currentlyPlaying: Song;
  },

  async playOrQueue(query: string, client: TicketBot, msg: Message): Promise<QueueResult> {
    if (!msg.member.voiceState.channelID) {
      return { status: QueueResults.NOT_IN_CHANNEL };
    }

    const { body } = await HTTP.get('http://localhost:2333/loadtracks')
      .addQuery('identifier', `ytsearch:${query}`)
      .addHeader('Authorization', client.opts.keys.lavalink)
      .addHeader('Accept', 'application/json');

    if (body.tracks.length === 0) {
      return { status: QueueResults.NOT_FOUND };
    }
    
    const track = body.tracks[0];
    const song: Song = {
      trackID: track.track,
      url: track.info.uri,
      title: track.info.title,
      thumbnail: 'https://cdn.discordapp.com/attachments/470338293880586250/672686569185869824/unknown.png',
      queuedBy: msg.author.id
    };

    return musicHandler.queue(
      song,
      client,
      client.voiceConnections.get((msg.channel as GuildChannel).guild.id) ||
        await client.joinVoiceChannel(msg.member.voiceState.channelID)
    );
  },

  async queue(song: Song, client: TicketBot, conn: VoiceConnection): Promise<QueueResult> {
    const position = musicHandler.state.songQueue.push(song);

    if (!conn.playing) {
      musicHandler.consume(client, conn);
      return { status: QueueResults.PLAYING, song };
    }

    if (conn.playing) {
      return { status: QueueResults.QUEUED, song, position };
    }
  },

  async consume(client: TicketBot, conn: VoiceConnection): Promise<void> {
    const song = musicHandler.state.songQueue.shift();
    musicHandler.state.currentlyPlaying = song;
    
    // await conn.setVolume(40);
    await conn.play(song.trackID);
    conn.once('end', async ({ reason }) => {
      if (reason === 'REPLACED') {
        return;
      }

      if (this.state.repeat) {
        return musicHandler.queue(song, client, conn);
      }

      if (this.state.songQueue.length === 0) {
        musicHandler.state.currentlyPlaying = null;
        const channelID = (conn as any).channelId;
        await (conn as any).stop();
        return client.leaveVoiceChannel(channelID);
      }

      musicHandler.consume(client, conn);
    });
  }
};