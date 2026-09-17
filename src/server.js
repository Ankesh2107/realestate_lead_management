require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const webhookRoutes = require('./routes/webhooks');
const testApiRoutes = require('./routes/testApi');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // needed for Twilio's form-encoded webhooks

// ---------- Static test UI ----------
app.use(express.static(path.join(__dirname, '..', 'public')));

// ---------- Channel webhooks (WhatsApp / Facebook / Instagram / Voice) ----------
app.use('/webhooks', webhookRoutes);

// ---------- Local test / dashboard API ----------
app.use('/api/test', testApiRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  logger.info(`Realty AI server running on http://localhost:${PORT}`);
  logger.info(`Test UI:              http://localhost:${PORT}`);
  logger.info(`WhatsApp webhook:     http://localhost:${PORT}/webhooks/whatsapp`);
  logger.info(`Facebook webhook:     http://localhost:${PORT}/webhooks/facebook`);
  logger.info(`Instagram webhook:    http://localhost:${PORT}/webhooks/instagram`);
  logger.info(`Voice incoming:       http://localhost:${PORT}/webhooks/voice/incoming`);
});
