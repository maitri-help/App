import * as Calendar from 'expo-calendar';
import { Platform } from 'react-native';

export async function createCalendarEvent(task) {
    const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
    );

    let defaultCalendar = null;

    if (Platform.OS === 'ios') {
        defaultCalendar = Calendar.getDefaultCalendarAsync();
    } else {
        defaultCalendar = calendars.find(
            (cal) =>
                cal.accessLevel === 'owner' && cal.name === cal.ownerAccount
        );
    }

    if (!defaultCalendar) {
        console.error('Default calendar not found');
        toast.show('Default calendar not found', { type: 'error' });
        return;
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
        endDate: endDate ? endDate : startDate,
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
