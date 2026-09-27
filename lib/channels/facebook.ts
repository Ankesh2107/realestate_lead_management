import * as meta from './metaMessenger';

export const verify = meta.verify;
export const receive = meta.makeReceiveHandler('facebook', 'META_PAGE_ACCESS_TOKEN');
