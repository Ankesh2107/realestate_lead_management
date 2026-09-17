const meta = require('./metaMessenger');

const verify = meta.verify;
const receive = meta.makeReceiveHandler('instagram', 'IG_PAGE_ACCESS_TOKEN');

module.exports = { verify, receive };
