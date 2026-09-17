import * as meta from './metaMessenger';

export const verify = meta.verify;
export const receive = meta.makeReceiveHandler('facebook', 'FB_PAGE_ACCESS_TOKEN');
