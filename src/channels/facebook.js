const meta = require('./metaMessenger');

const verify = meta.verify;
const receive = meta.makeReceiveHandler('facebook', 'FB_PAGE_ACCESS_TOKEN');

module.exports = { verify, receive };
