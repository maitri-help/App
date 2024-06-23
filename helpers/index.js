export const generateRandomNumber = (length) => {
    return Math.floor(Math.random() * length);
};

export const generateRandomQuote = (quotes) => {
    const randomIndex = generateRandomNumber(quotes.length);
    return quotes[randomIndex];
};

//shuffle order of array randomly
export const shuffleArray = (array) => {
    return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
};

export const generateGreetings = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
        return 'Good morning';
    } else if (currentHour < 18) {
        return 'Good afternoon';
    } else {
        return 'Good evening';
    }
};
