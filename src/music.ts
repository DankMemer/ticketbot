import { Message, VoiceConnection } from 'eris';
import TicketBot from './Client';
import ytdl from 'ytdl-core';
import HTTP from './lib/http';

export type Song = {
  url: string;
  title: string;
  queuedBy: string;
  thumbnail: string;
};

export enum QueueResults {
  QUEUED,
  PLAYING,
  NOT_FOUND,
  NOT_IN_CHANNEL
};

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

  async playOrQueue(url: string, client: TicketBot, msg: Message): Promise<QueueResult> {
    if (!msg.member.voiceState) {
      return { status: QueueResults.NOT_IN_CHANNEL };
    }

    if (!ytdl.validateID(url)) {
      const { body } = await HTTP.get('https://www.googleapis.com/youtube/v3/search')
        .addQuery('maxResults', 1)
        .addQuery('part', 'id')
        .addQuery('key', client.opts.keys.youtube)
        .addQuery('q', url);

      if (body.items.length === 0) {
        return { status: QueueResults.NOT_FOUND };
      }

      url = `https://www.youtube.com/watch?v=${body.items[0].id.videoId}`;
    }

    const res = await ytdl.getBasicInfo(url).catch(() => {});
    if (!res) {
      return { status: QueueResults.NOT_FOUND };
    }

    const song: Song = {
      url,
      title: res.player_response.videoDetails.title,
      thumbnail: res.player_response.videoDetails.thumbnail.thumbnails[0].url,
      queuedBy: msg.author.id
    };

    return musicHandler.queue(song, client, await client.joinVoiceChannel(msg.member.voiceState.channelID));
  },

  async queue(song: Song, client: TicketBot, conn: VoiceConnection) {
    const position = musicHandler.state.songQueue.push(song);

    if (!conn.playing) {
      musicHandler.consume(client, conn);
      return { status: QueueResults.PLAYING, song };
    }

    if (conn.playing) {
      return { status: QueueResults.QUEUED, song, position };
    }
  },

  async consume(client: TicketBot, conn: VoiceConnection) {
    const song = musicHandler.state.songQueue.shift();
    musicHandler.state.currentlyPlaying = song;

    await conn.play(ytdl(song.url, { filter: 'audioonly' }));
    conn.on('end', () => {
      if (this.state.repeat) {
        return musicHandler.queue(song, client, conn);
      }

      if (this.state.songQueue.length === 0) {
        musicHandler.state.currentlyPlaying = null;
        return client.leaveVoiceChannel(conn.channelID);
      }

      musicHandler.consume(client, conn);
    });
  }
}