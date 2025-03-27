import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { 'en-US': enUS },
});

export default function CalendarComponent() {
  const events: CalendarEvent[] = [];

  return (
    <div className="h-[80vh] w-full">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{
          borderRadius: '0.75rem',
          padding: '1rem',
        }}
        className="dark:bg-[#0a0a0a] dark:text-[#EDEDEC]"
      />
    </div>
  );
}