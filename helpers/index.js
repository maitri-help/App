export const generateRandomNumber = (length) => {
    return Math.floor(Math.random() * length);
};

export const generateRandomQuote = (quotes) => {
    const randomIndex = generateRandomNumber(quotes.length);
    return quotes[randomIndex];
};
