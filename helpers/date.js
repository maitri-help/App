import { isBefore } from 'date-fns';

export function isStartDateBeforeEndDate(startDate, endDate) {
    return isBefore(startDate, endDate);
}
