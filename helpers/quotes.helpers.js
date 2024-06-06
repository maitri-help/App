export const getInitialBoxes = (
    onAddNewTask,
    randomQuote,
    randomMotivationalQuote,
    openModal
) => [
    {
        title: 'No tasks yet?',
        buttons: [
            {
                title: 'Add a new task',
                onPress: () => onAddNewTask()
            }
        ],
        bgColor: '#E5F5E3',
        bgImgColor: '#D6EFD2',
        bgImg: 4
    },
    {
        title: randomQuote,
        bgColor: '#D4E6E5',
        bgImgColor: '#B7D6D3'
    },
    {
        title: randomMotivationalQuote,
        bgColor: '#E1D0FD',
        bgImgColor: '#EDE3FE',
        bgImg: 2
    },
    {
        title: 'Come add family & friends to your circles',
        buttons: [
            {
                title: 'Add a new person',
                bgColor: '#fff',
                textColor: '#000',
                onPress: () => openModal(true)
            }
        ],
        bgColor: '#FFE8D7',
        bgImgColor: '#FFD8BC',
        bgImg: 2
    }
];
