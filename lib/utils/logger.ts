export const logger = {
  info: (msg: string, extra: any = '') => {
    console.log(`[${new Date().toISOString()}] [INFO] ${msg}`, extra || '');
  },
  warn: (msg: string, extra: any = '') => {
    console.warn(`[${new Date().toISOString()}] [WARN] ${msg}`, extra || '');
  },
  error: (msg: string, extra: any = '') => {
    console.error(`[${new Date().toISOString()}] [ERROR] ${msg}`, extra || '');
  },
};
export default logger;
