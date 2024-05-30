import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import CustomBox from '../CustomBox';
import { generateRandomQuote, shuffleArray } from '../../helpers';
import { motivationalQuotes, quotes } from '../../constants/quotes';
import { getInitialBoxes } from '../../helpers/quotes.helpers';

const LeadBoxes = ({ navigation }) => {
    const [randomQuote, setRandomQuote] = useState('');
    const [randomMotivationalQuote, setRandomMotivationalQuote] = useState('');
    const [boxes, setBoxes] = useState([]);

    useEffect(() => {
        const quote = generateRandomQuote(quotes);
        const motivationalQuote = generateRandomQuote(motivationalQuotes);

        setRandomQuote(quote);
        setRandomMotivationalQuote(motivationalQuote);
    }, []);

    useEffect(() => {
        if (randomQuote && randomMotivationalQuote) {
            const initialBoxes = getInitialBoxes(
                navigation,
                randomQuote,
                randomMotivationalQuote
            );
            setBoxes(shuffleArray(initialBoxes));
        }
    }, [randomQuote, randomMotivationalQuote, navigation]);

    return (
        <View style={styles.boxesContainer}>
            <ScrollView horizontal={true} style={styles.boxesScroll}>
                <View style={{ marginLeft: 15 }} />

                {boxes.map((box, index) => (
                    <CustomBox
                        key={index}
                        title={box.title}
                        buttons={box.buttons}
                        bgColor={box.bgColor}
                        bgImgColor={box.bgImgColor}
                        bgImg={box.bgImg}
                    />
                ))}
                <View style={{ marginRight: 15 }} />
            </ScrollView>
        </View>
    );
};

export default LeadBoxes;

const styles = StyleSheet.create({
    boxesScroll: {
        paddingVertical: 20
    }
});
