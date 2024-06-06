import isEmpty from 'lodash/isEmpty';
import {
    FUTURE_DAYS,
    ONE_DAY_IN_MILLISECONDS,
    PAST_DAYS
} from '../constants/variables';

const today = new Date().toISOString().split('T')[0];
const fastDate = getPastDate(PAST_DAYS);
const futureDates = getFutureDates(FUTURE_DAYS);
const dates = [fastDate, today].concat(futureDates);

function getFutureDates(numberOfDays) {
    const array = [];
    for (let index = 1; index <= numberOfDays; index++) {
        let d = Date.now();
        if (index > 8) {
            // set dates on the next month
            const newMonth = new Date(d).getMonth() + 1;
            d = new Date(d).setMonth(newMonth);
        }
        const date = new Date(d + ONE_DAY_IN_MILLISECONDS * index);
        const dateString = date.toISOString().split('T')[0];
        array.push(dateString);
    }
    return array;
}
function getPastDate(numberOfDays) {
    return new Date(Date.now() - ONE_DAY_IN_MILLISECONDS * numberOfDays)
        .toISOString()
        .split('T')[0];
}

export const generateAgendaItems = (tasks) => {
    const items = [];
    dates.forEach((date) => {
        const data = [];
        tasks.forEach((task) => {
            if (+new Date(task.startDate) === +new Date(date)) {
                data.push(task);
            }
        });
        items.push({ title: date, data: data.length ? data : [{}] });
    });
    return items;
};

export function getMarkedDates(agendaItems) {
    const marked = {};

    agendaItems.forEach((item) => {
        // NOTE: only mark dates with data
        if (item.data && item.data.length > 0 && !isEmpty(item.data[0])) {
            const isAllCompleted = item.data.every(
                (task) => task.status === 'done'
            );

            if (isAllCompleted) {
                marked[item.title] = { marked: false };
            } else {
                marked[item.title] = { marked: true };

                const isUnassigned = item.data.every(
                    (task) => task.assignedUserId === null
                );
                if (isUnassigned) {
                    marked[item.title] = { marked: true, dotColor: '#B22525' };
                } else {
                    marked[item.title] = { marked: true, dotColor: '#D5D5D5' };
                }
            }
        }
    });
    return marked;
}
