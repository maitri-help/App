import { isBefore, isEqual } from 'date-fns';

export function isStartDateBeforeEndDate(startDate, endDate) {
    return isBefore(startDate, endDate) || isEqual(startDate, endDate);
}
