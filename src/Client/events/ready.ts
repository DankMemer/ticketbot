import Event from './Event';
export const onReady: Event = {
  packetName: 'ready',
  handler() {
    console.log('ready');
    this.editStatus('invisible');
  }
};
