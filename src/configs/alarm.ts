import { AlarmOptions } from '@/@types/Option';

const alarmConfig = (): AlarmOptions => ({
  TOKEN: String(process.env.SYNOLOGY_INCOMING_TOKEN),
  WEBHOOK_URL: String(process.env.SYNOLOGY_INCOMING_URL),
});

export default alarmConfig;
