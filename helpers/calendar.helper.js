import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';
import { mergeDateAndTime } from './date';

export async function createCalendarEvent(task) {
    let defaultCalendar = null;

    if (Platform.OS === 'ios') {
        defaultCalendar = await Calendar.getDefaultCalendarAsync();
    } else {
        const calendars = await Calendar.getCalendarsAsync(
            Calendar.EntityTypes.EVENT
        );

        defaultCalendar = calendars.find(
            (cal) =>
                cal.isPrimary || (cal.accessLevel === 'owner' && cal.name === cal.ownerAccount)
        );
    }

    if (!defaultCalendar) {
        throw new Error('No default calendar found');
    }

    const isAllDay = !task?.startTime && !task?.endTime && !task?.endDate;

    let endDate;

    const startDate = task?.startTime
        ? mergeDateAndTime(task?.startDate, task?.startTime)
        : new Date(task?.startDate);

    if (task?.endDate) {
        endDate = task?.endTime
            ? mergeDateAndTime(task?.endDate, task?.endTime)
            : new Date(task?.endDate);
    }

    const event = {
        title: task?.title,
        startDate: startDate,
        endDate: (endDate && endDate > startDate) ? endDate : startDate,
        notes: task?.description,
        allDay: isAllDay
    };


    await Calendar.createEventAsync(defaultCalendar.id, event)
        .then((event) => {
            return event;
        })
        .catch((error) => {
            throw new Error(error);
        });
};
