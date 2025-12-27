import { parseIcsCalendar } from '@ts-ics/schema-zod';
import { IcsCalendar, IcsEvent } from 'ts-ics';
import {
  calendarID,
  calendarScopeID,
  LOUNGE_BOOKING_EVENT_PREFIX,
} from '../constants/calendar';
import { timezonedDayJS } from '../helpers/dayjs';

const calendarURL = `https://outlook.office365.com/owa/published/${calendarScopeID}/${calendarID}/calendar.ics`;
type EventWithEndDate = Extract<IcsEvent, { end: { date: Date } }>;
export async function getTodayBookings() {
  const response = await fetch(calendarURL);
  const data = await response.text();
  const { events }: IcsCalendar = parseIcsCalendar(data);
  if (!events) throw new Error('чето пошло не так');
  const now = timezonedDayJS();

  const upcomingEvents = events.filter((event): event is EventWithEndDate => {
    const eventDate = timezonedDayJS(event.start.date);
    return (
      event.summary.startsWith(LOUNGE_BOOKING_EVENT_PREFIX) &&
      eventDate.isSame(now, 'day') &&
      eventDate.isAfter(now) &&
      !!event.end
    );
  });
  return upcomingEvents;
}
const timeFormat = 'h:mm A';
export function formatEventsSummary(events: EventWithEndDate[]) {
  let str = '';
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    str += `с ${timezonedDayJS(event.start.date).format(timeFormat)} до ${timezonedDayJS(
      event.end.date,
    ).format(timeFormat)}`;
    if (i < events.length - 2) {
      str += ', ';
    } else if (i < events.length - 1) {
      str += ' и ';
    }
  }
  return str;
}
