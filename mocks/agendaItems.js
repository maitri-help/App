import isEmpty from 'lodash/isEmpty';

const today = new Date().toISOString().split('T')[0];
const fastDate = getPastDate(3);
const futureDates = getFutureDates(12);
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
        const date = new Date(d + 864e5 * index); // 864e5 == 86400000 == 24*60*60*1000
        const dateString = date.toISOString().split('T')[0];
        array.push(dateString);
    }
    return array;
}

function getPastDate(numberOfDays) {
    return new Date(Date.now() - 864e5 * numberOfDays).toISOString().split('T')[0];
}

export const agendaItems = [
    {
        title: dates[0],
        data: [{ icon: require('../assets/emojis/heart-icon.png'), circleColor: '#26847B', startTime: '1pm', endTime: '2pm', name: 'Rachel Green', title: 'Take out biggie' }]
    },
    {
        title: dates[1],
        data: [
            {  icon: require('../assets/emojis/doctor-icon.png'), circleColor: '#FF8A35', startTime: '4pm', endTime: '6pm', name: 'Chandler Bing', title: 'Ride to doctor' },
            {  icon: require('../assets/emojis/hearts-icon.png'), circleColor: '#7FCC72', startTime: '6pm', endTime: '6:30pm', name: 'Monica Geller', title: 'Buy groceries' }
        ]
    },
    {
        title: dates[2],
        data: [
            {  icon: require('../assets/emojis/luck-icon.png'), circleColor: '#A571F9', startTime: '1pm', endTime: '2pm', name: 'Ross Geller', title: 'Tidy up and clean the house' },
            {  icon: require('../assets/emojis/rock-icon.png'), circleColor: '#1C4837', startTime: '2pm', endTime: '3pm', name: 'Joey Tribbiani', title: 'Transportation to Sheba Hospital' },
            {  icon: require('../assets/emojis/robot-icon.png'), circleColor: '#26847B', startTime: '3pm', endTime: '4:15pm', name: 'Phoebe Buffay', title: 'Call the National Insurance' }
        ]
    },
    {
        title: dates[3],
        data: [{  icon: require('../assets/emojis/doctor-icon.png'), circleColor: '#FF8A35', startTime: '12am', endTime: '1am', name: 'Rachel Green', title: 'Take medication' }]
    },
    {
        title: dates[4],
        data: [{}]
    },
    {
        title: dates[5],
        data: [
            {  icon: require('../assets/emojis/doctor-icon.png'), circleColor: '#7FCC72', startTime: '8pm', endTime: '9pm', name: 'Chandler Bing', title: 'Physiotherapy appointment' },
            {  icon: require('../assets/emojis/robot-icon.png'), circleColor: '#A571F9', startTime: '10pm', endTime: '11pm', name: 'Monica Geller', title: 'Remember to write down how I felt today' },
            {  icon: require('../assets/emojis/heart-icon.png'), circleColor: '#1C4837', startTime: '11pm', endTime: '12am', name: 'Ross Geller', title: 'Take out biggie' },
            {  icon: require('../assets/emojis/doctor-icon.png'), circleColor: '#26847B', startTime: '8am', endTime: '9am', name: 'Joey Tribbiani', title: 'Ride to doctor' }
        ]
    },
    {
        title: dates[6],
        data: [
            {  icon: require('../assets/emojis/hearts-icon.png'), circleColor: '#FF8A35', startTime: '12pm', endTime: '1:30pm', name: 'Phoebe Buffay', title: 'Buy groceries' }
        ]
    },
    {
        title: dates[7],
        data: [{}]
    },
    {
        title: dates[8],
        data: [
            {  icon: require('../assets/emojis/luck-icon.png'), circleColor: '#7FCC72', startTime: '1pm', endTime: '2pm', name: 'Rachel Green', title: 'Tidy up and clean the house' },
            {  icon: require('../assets/emojis/rock-icon.png'), circleColor: '#A571F9', startTime: '2pm', endTime: '3pm', name: 'Chandler Bing', title: 'Transportation to Sheba Hospital' },
            {  icon: require('../assets/emojis/robot-icon.png'), circleColor: '#1C4837', startTime: '3pm', endTime: '4:15pm', name: 'Monica Geller', title: 'Call the National Insurance' },
            {  icon: require('../assets/emojis/heart-icon.png'), circleColor: '#26847B', startTime: '7pm', endTime: '7:30pm', name: 'Ross Geller', title: 'Take medication' }
        ]
    },
    {
        title: dates[9],
        data: [
            {  icon: require('../assets/emojis/doctor-icon.png'), circleColor: '#FF8A35', startTime: '1pm', endTime: '2pm', name: 'Joey Tribbiani', title: 'Physiotherapy appointment' },
            {  icon: require('../assets/emojis/heart-icon.png'), circleColor: '#7FCC72', startTime: '3pm', endTime: '4pm', name: 'Phoebe Buffay', title: 'Remember to write down how I felt today' },
            {  icon: require('../assets/emojis/hearts-icon.png'), circleColor: '#A571F9', startTime: '5pm', endTime: '6pm', name: 'Rachel Green', title: 'Buy groceries' }
        ]
    },
    {
        title: dates[10],
        data: [
            {  icon: require('../assets/emojis/heart-icon.png'), circleColor: '#1C4837', startTime: '12am', endTime: '1am', name: 'Chandler Bing', title: 'Take out biggie' }
        ]
    },
    {
        title: dates[11],
        data: [
            {  icon: require('../assets/emojis/heart-icon.png'), circleColor: '#26847B', startTime: '1pm', endTime: '2pm', name: 'Monica Geller', title: 'Take medication' },
            {  icon: require('../assets/emojis/hearts-icon.png'), circleColor: '#FF8A35', startTime: '2pm', endTime: '3pm', name: 'Ross Geller', title: 'Buy groceries' },
            {  icon: require('../assets/emojis/heart-icon.png'), circleColor: '#7FCC72', startTime: '3pm', endTime: '4pm', name: 'Joey Tribbiani', title: 'Take out biggie' }
        ]
    },
    {
        title: dates[12],
        data: [
            {  icon: require('../assets/emojis/heart-icon.png'), circleColor: '#A571F9', startTime: '12am', endTime: '1am', name: '', title: 'Take out biggie' }
        ]
    },
    {
        title: dates[13],
        data: [
            {  icon: require('../assets/emojis/heart-icon.png'), circleColor: '#1C4837', startTime: '12am', endTime: '1am', name: '', title: 'Take out biggie' }
        ]
    }
];

export function getMarkedDates() {
    const marked = {};

    agendaItems.forEach(item => {
        // NOTE: only mark dates with data
        if (item.data && item.data.length > 0 && !isEmpty(item.data[0])) {
            marked[item.title] = { marked: true };
        } else {
            marked[item.title] = { disabled: true };
        }
    });
    return marked;
}