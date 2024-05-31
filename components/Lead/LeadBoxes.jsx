import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Animated } from 'react-native';
import CustomBox from '../CustomBox';
import { generateRandomQuote, shuffleArray } from '../../helpers';
import { motivationalQuotes, quotes } from '../../constants/quotes';
import { getInitialBoxes } from '../../helpers/quotes.helpers';
import SendInviteScreen from '../../screens/SendInviteScreen';
import Styles from '../../Styles';

const LeadBoxes = ({ navigation }) => {
    const [randomQuote, setRandomQuote] = useState('');
    const [randomMotivationalQuote, setRandomMotivationalQuote] = useState('');
    const [boxes, setBoxes] = useState([]);

    const [sendInvitesModalVisible, setSendInvitesModalVisible] =
        useState(false);

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
                randomMotivationalQuote,
                setSendInvitesModalVisible
            );
            setBoxes(shuffleArray(initialBoxes));
        }
    }, [randomQuote, randomMotivationalQuote, navigation]);

    const overlayOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (sendInvitesModalVisible) {
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
        } else {
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
        }
    }, [sendInvitesModalVisible]);

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

            {sendInvitesModalVisible && (
                <Animated.View
                    style={[Styles.overlay, { opacity: overlayOpacity }]}
                />
            )}
            <SendInviteScreen
                visible={sendInvitesModalVisible}
                onClose={() => setSendInvitesModalVisible(false)}
                navigation={navigation}
            />
        </View>
    );
};

export default LeadBoxes;

const styles = StyleSheet.create({
    boxesScroll: {
        paddingVertical: 20
    }
});
