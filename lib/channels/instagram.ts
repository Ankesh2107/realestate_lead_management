import * as meta from './metaMessenger';

export const verify = meta.verify;
export const receive = meta.makeReceiveHandler('instagram', 'META_INSTAGRAM_ACCESS_TOKEN');
