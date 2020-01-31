import { REPO_URL } from '../Constants';
import querystring from 'querystring';
import https from 'https';
import { IncomingHttpHeaders, OutgoingHttpHeaders, request } from 'http';
import url from 'url';

export type HTTPResult = {
  raw: Buffer;
  body: any;
  ok: boolean;
  statusCode: number;
  statusText: string;
  headers: IncomingHttpHeaders;
};

export default class HTTP implements Promise<HTTPResult> {
  private res: Promise<any>;
  private method: 'GET' | 'POST' | 'PUT';
  private uri: string;
  private data?: Buffer;
  private query: { [k: string]: string | number } = {};
  private headers: OutgoingHttpHeaders = {
    'user-agent': REPO_URL
  };

  private constructor(method: HTTP['method'], uri: HTTP['uri']) {
    this.method = method;
    this.uri = uri;
  }

  public addQuery(key: string, value: string | number): this;
  public addQuery(query: object): this;
  public addQuery(key: string | object, value?: string | number): this {
    const mutation = typeof key === 'string' ? { [key]: value } : key;
    this.query = { ...this.query, ...mutation };
    return this;
  }

  public addHeader(key: string, value: string): this;
  public addHeader(header: object): this;
  public addHeader(key: string | object, value?: string): this {
    const mutation = typeof key === 'string' ? { [key.toLowerCase()]: value } : key;
    this.headers = { ...this.headers, ...mutation };
    return this;
  }

  public send(data: object | string | Buffer): this {
    if (data instanceof Buffer) {
      this.data = data;
    } else if (typeof data === 'string') {
      this.data = Buffer.from(data);
    } else {
      const serialize = this.headers['content-type'] === 'application/x-www-form-urlencoded'
        ? querystring.encode
        : JSON.stringify;

      this.data = Buffer.from(serialize(data));
    }

    return this;
  }

  private execute(): Promise<HTTPResult> {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line prefer-const
      let { method, uri, headers, query, data } = this;

      if (Object.keys(query).length !== 0) {
        uri += `?${querystring.encode(query)}`;
      }

      const req = (uri.startsWith('https') ? https.request : request)({
        method,
        headers,
        ...url.parse(uri)
      }, (res) => {
        const chunks = [];

        res.on('data', (chunk) => chunks.push(chunk));
        res.once('error', reject);
        res.once('end', () => {
          const raw = Buffer.concat(chunks);

          const body: HTTPResult['body'] = ((): any => {
            if ((/application\/json/).test(res.headers['content-type'])) {
              try {
                return JSON.parse(raw.toString());
              } catch (_) {
                // fall through
              }
            }

            return raw;
          })();

          const result: HTTPResult = {
            raw,
            body,
            ok: res.statusCode >= 200 && res.statusCode < 400,
            statusCode: res.statusCode,
            statusText: res.statusMessage,
            headers: res.headers
          };

          if (result.ok) {
            resolve(result);
          } else {
            reject(result);
          }
        });
      });

      req.once('error', reject);

      if (data) {
        req.write(data);
      }

      req.end();
    });
  }

  public then<ChainFullfill = HTTPResult, ChainReject = never>(
    onfulfilled?: (value: HTTPResult) => Promise<ChainFullfill>,
    onrejected?: (reason: any) => Promise<ChainReject>
  ): Promise<ChainFullfill | ChainReject> {
    if (this.res) {
      return this.res.then(onfulfilled, onrejected);
    }

    return (
      this.res = this.execute().then(onfulfilled, onrejected)
    );
  }

  public catch(onrejected): Promise<HTTPResult> {
    return this.then(null, onrejected);
  }

  public finally(onfinally: () => Promise<HTTPResult> & void): Promise<HTTPResult> {
    return this.then(onfinally, onfinally);
  }

  get [Symbol.toStringTag](): string {
    return 'todo';
  }

  public static get(uri: string): HTTP {
    return new HTTP('GET', uri);
  }

  public static post(uri: string): HTTP {
    return new HTTP('POST', uri);
  }

  public static put(uri: string): HTTP {
    return new HTTP('PUT', uri);
  }
}
