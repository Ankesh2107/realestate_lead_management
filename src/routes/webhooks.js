const express = require('express');
const router = express.Router();

const whatsapp = require('../channels/whatsapp');
const facebook = require('../channels/facebook');
const instagram = require('../channels/instagram');
const voice = require('../channels/voice');

// ---------- WhatsApp Cloud API ----------
router.get('/whatsapp', whatsapp.verify);
router.post('/whatsapp', whatsapp.receive);

// ---------- Facebook Messenger ----------
router.get('/facebook', facebook.verify);
router.post('/facebook', facebook.receive);

// ---------- Instagram DM ----------
router.get('/instagram', instagram.verify);
router.post('/instagram', instagram.receive);

// ---------- Twilio Voice ----------
router.post('/voice/incoming', voice.incoming);
router.post('/voice/gather', voice.gather);

module.exports = router;
