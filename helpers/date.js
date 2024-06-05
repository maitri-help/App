import {
    isBefore,
    isEqual,
    parseISO,
    isDate,
    format,
    startOfDay,
    endOfDay,
    isWithinInterval
} from 'date-fns';
import { en } from 'date-fns/locale';

export function isStartDateBeforeEndDate(startDate, endDate) {
    return isBefore(startDate, endDate) || isEqual(startDate, endDate);
}

export const getDaysBetween = (start, end) => {
    let currentDate = new Date(start);
    const endDate = new Date(end);
    let markedDates = {};
    currentDate.setDate(currentDate.getDate() + 1);
    while (currentDate < endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        markedDates[dateString] = { color: '#1C4837', textColor: '#fff' };
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return markedDates;
};

const defaultOptions = {
    formatString: 'yyyy MMMM do',
    locale: en
};

export function formatDate(dateInput, options) {
    if (!dateInput) return '';

    const { formatString, locale } = { ...defaultOptions, ...options };
    const date = isDate(dateInput) ? dateInput : parseISO(dateInput);

    return format(date, formatString, { locale });
}

export function generateDateString(startDate, endDate, startTime, endTime) {
    let dateString = '';

    if (startDate) dateString += formatDate(startDate);

    if (startTime) dateString += ' ' + startTime;

    if (endTime && endDate) {
        dateString += ' - ' + formatDate(endDate) + ' ' + endTime;
    } else if (endTime && !endDate) {
        dateString += ' - ' + formatDate(startDate) + ' ' + endTime;
    } else if (endDate && !endTime) {
        dateString += ' - ' + formatDate(endDate);
    }

    return dateString;
}
export const formatTaskItemDate = (task) => {
    const start = new Date(task?.startDate);
    const end = new Date(task?.endDate);
    const isSameDay = start.getTime() === end.getTime();

    const formatOptions = (options) => formatDate(task?.startDate, options);

    if (isSameDay) {
        return formatOptions({ formatString: 'MMMM dd' });
    }

    if (task?.startTime && !task?.endDate) {
        const options = { formatString: "MMMM d 'at' p" };
        return `${formatOptions(options)} - ${formatDate(
            task?.endDate,
            options
        )}`;
    }

    if (task?.startTime && task?.endTime) {
        const mergedStartDate = mergeDateAndTime(
            task?.startDate,
            task?.startTime
        );
        const mergedEndDate = mergeDateAndTime(task?.endDate, task?.endTime);
        const options = { formatString: "MMMM d 'at' p" };
        return `${formatDate(mergedStartDate, options)} - ${formatDate(
            mergedEndDate,
            options
        )}`;
    }

    if (!task?.startTime && !task?.endTime) {
        const options = { formatString: 'MMMM dd' };
        return `${formatOptions(options)} - ${formatDate(
            task?.endDate,
            options
        )}`;
    }

    return '';
};

export const isDateInRange = (date, startDate, endDate) => {
    const d = startOfDay(new Date(date));
    const start = startOfDay(new Date(startDate));
    const end = endDate
        ? startOfDay(new Date(endDate))
        : endOfDay(new Date(startDate));

    return isWithinInterval(d, { start, end });
};

export function mergeDateAndTime(startDate, time) {
    const date = new Date(startDate);
    const [hours, minutes] = time.split(':').map(Number);
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
}

export const isWithinTimeframe = (date, range) => {
    const hours = date.getHours();

    if (range.start <= range.end) {
        return hours >= range.start && hours < range.end;
    } else {
        // Handles the wrap-around for night timeframe
        return hours >= range.start || hours < range.end;
    }
};
