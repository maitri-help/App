import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, Animated } from 'react-native';
import CustomBox from '../CustomBox';
import { generateRandomQuote, shuffleArray } from '../../helpers';
import { motivationalQuotes, quotes } from '../../constants/quotes';
import { getInitialBoxes } from '../../helpers/quotes.helpers';
import SendInviteScreen from '../../screens/SendInviteScreen';
import Styles from '../../Styles';
import { sendThankYouCard } from '../../hooks/api';
import { checkAuthentication } from '../../authStorage';
import { useToast } from 'react-native-toast-notifications';

const LeadBoxes = ({ navigation, thankYouCards = [], setThankYouCards }) => {
    const [randomQuote, setRandomQuote] = useState('');
    const [randomMotivationalQuote, setRandomMotivationalQuote] = useState('');
    const [boxes, setBoxes] = useState([]);
    const [thankYouBoxes, setThankYouBoxes] = useState([]);

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

    useEffect(() => {
        if (thankYouCards.length > 0) {
            const thankYouBoxes = thankYouCards.map((card) => ({
                thankYouCardId: card.thankYouCardId,
                supporterUserName: card.supporterUserName,
                taskName: card.taskName,
                buttons: [{ title: 'Say thank you!', bgColor: '#fff', textColor: '#000', onPress: () => { onThankYouPress(card.thankYouCardId) }, disabled: false}]
            }));
            setThankYouBoxes(thankYouBoxes);
        }
    }, [thankYouCards]);

    const toast = useToast();

    const onThankYouPress = async (cardId) => {
        try {
            const userData = await checkAuthentication();
            if (userData) {
                const accessToken = userData.accessToken;
                const sendResponse = await sendThankYouCard(cardId, accessToken);
                if (sendResponse.data && sendResponse.data.length >= 0) {
                    toast.show('Thank you sent!', { type: 'success' });
                    const newThankYouCards = sendResponse.data;
                    setThankYouBoxes(thankYouBoxes.filter((box) => box.thankYouCardId !== cardId));
                    setThankYouCards(newThankYouCards);
                }
            }
        } catch (error) {
            console.log('Error sending thank you card', error);
        }        
    };

    return (
        <View style={styles.boxesContainer}>
            <ScrollView horizontal={true} style={styles.boxesScroll}>
                <View style={{ marginLeft: 15 }} />

                {thankYouBoxes.length > 0 && (
                    thankYouBoxes.map((box) => (
                        <CustomBox
                            key={box.thankYouCardId}
                            title={box.supporterUserName}
                            subtitle="Has completed"
                            largerText={box.taskName}
                            bgColor="#FFE8D7"
                            bgImgColor="#FFD8BC"
                            buttons={box.buttons}
                        />
                    ))
                )}

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
