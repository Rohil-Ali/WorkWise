# declare module 'react-big-calendar';


declare module 'react-big-calendar' {
  import { ComponentType } from 'react';
  export interface CalendarProps {
    localizer: any;
    events: any[];
    startAccessor: string;
    endAccessor: string;
    selectable?: boolean;
    onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
    onSelectEvent?: (event: any) => void;
    defaultDate?: Date;
  }
  const Calendar: ComponentType<CalendarProps>;
  export { Calendar };
}