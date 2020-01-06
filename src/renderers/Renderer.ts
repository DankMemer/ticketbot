import { EmbedOptions } from 'eris';

export default interface Renderer {
  render(...any): EmbedOptions;
  States?: object;
}
