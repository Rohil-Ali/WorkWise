import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import { enUS } from 'date-fns/locale';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales: { 'en-US': enUS },
});

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Calendar', href: '/calendar' }];

export default function CalendarPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sync with device calendar
    useEffect(() => {
        const loadEvents = async () => {
            try {
                // Check for device calendar access
                if ('calendar' in navigator) {
                    // @ts-ignore - TypeScript doesn't know about this API
                    const calendars = await navigator.calendar.getCalendars();
                    const deviceEvents = await Promise.all(
                        calendars.map(async (calendar: any) => {
                            // @ts-ignore
                            const events = await calendar.getEvents();
                            return events.map((event: any) => ({
                                id: event.id,
                                title: event.title,
                                start: new Date(event.startDate),
                                end: new Date(event.endDate),
                                description: event.description,
                                location: event.location,
                            }));
                        }),
                    );
                    setEvents(deviceEvents.flat());
                } else {
                    // Fallback to localStorage
                    const savedEvents = localStorage.getItem('calendarEvents');
                    if (savedEvents) {
                        const parsedEvents = JSON.parse(savedEvents).map((e: any) => ({
                            ...e,
                            start: new Date(e.start),
                            end: new Date(e.end),
                        }));
                        setEvents(parsedEvents);
                    } else {
                        // Default demo events
                        setEvents([
                            {
                                id: '1',
                                title: 'Team Meeting',
                                start: new Date(new Date().setHours(10, 0, 0)),
                                end: new Date(new Date().setHours(11, 0, 0)),
                                location: 'Conference Room A',
                            },
                            {
                                id: '2',
                                title: 'Project Deadline',
                                start: new Date(Date.now() + 86400000 * 3), // 3 days from now
                                end: new Date(Date.now() + 86400000 * 3 + 3600000),
                                description: 'Submit final deliverables',
                            },
                        ]);
                    }
                }
            } catch (error) {
                console.error('Error loading events:', error);
                // Fallback to localStorage if device access fails
                const savedEvents = localStorage.getItem('calendarEvents');
                if (savedEvents) {
                    setEvents(JSON.parse(savedEvents));
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadEvents();
    }, []);

    // Save events to localStorage when they change
    useEffect(() => {
        if (events.length > 0 && !isLoading) {
            localStorage.setItem('calendarEvents', JSON.stringify(events));
        }
    }, [events, isLoading]);

    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        const title = prompt('Enter event title:');
        if (title) {
            const newEvent = {
                id: Date.now().toString(),
                title,
                start: slotInfo.start,
                end: slotInfo.end || new Date(slotInfo.start.getTime() + 3600000), // Default 1 hour duration
            };
            setEvents([...events, newEvent]);

            // Try to sync with device calendar
            if ('calendar' in navigator) {
                try {
                    // @ts-ignore
                    navigator.calendar.createEvent(newEvent);
                } catch (error) {
                    console.log('Event saved locally (device calendar not available)');
                }
            }
        }
    };

    const handleSelectEvent = (event: CalendarEvent) => {
        if (confirm(`Delete "${event.title}"?`)) {
            setEvents(events.filter((e) => e.id !== event.id));

            // Try to remove from device calendar
            if ('calendar' in navigator) {
                try {
                    // @ts-ignore
                    navigator.calendar.deleteEvent(event.id);
                } catch (error) {
                    console.log('Event deleted locally (device calendar not available)');
                }
            }
        }
    };

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Loading Calendar" />
                <div className="flex h-[80vh] items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />
            <div className="flex h-full flex-1 flex-col rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex-1 rounded-xl border">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        selectable
                        onSelectSlot={handleSelectSlot}
                        onSelectEvent={handleSelectEvent}
                        defaultView="week"
                        defaultDate={new Date()}
                        style={{
                            height: '80vh',
                            borderRadius: '0.75rem',
                            padding: '1rem',
                        }}
                        className="dark:bg-[#0a0a0a] dark:text-[#EDEDEC]"
                        components={{
                            event: ({ event }) => (
                                <div className="p-1">
                                    <strong>{event.title}</strong>
                                    {event.location && <div className="text-xs">{event.location}</div>}
                                </div>
                            ),
                        }}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
