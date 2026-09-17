import * as meta from './metaMessenger';

export const verify = meta.verify;
export const receive = meta.makeReceiveHandler('instagram', 'IG_PAGE_ACCESS_TOKEN');
