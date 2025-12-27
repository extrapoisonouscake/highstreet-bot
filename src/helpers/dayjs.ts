import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);
const INSTANTIATED_TIMEZONE = 'America/Vancouver';
dayjs.tz.setDefault(INSTANTIATED_TIMEZONE);
export const timezonedDayJS = (...args: Parameters<typeof dayjs>) => {
  return dayjs(...args).tz(INSTANTIATED_TIMEZONE);
};
