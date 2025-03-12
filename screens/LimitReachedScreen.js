import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import ArrowLeftIcon from '../assets/icons/arrow-left-icon.svg';
import CheckIcon from '../assets/icons/check-icon.svg';
import { Dimensions } from 'react-native';
import IAPService from '../services/IAPService';
import { useToast } from 'react-native-toast-notifications';

const SUBSCRIPTION_PLANS = [
    { id: 'com.maitri.premium.monthly', months: 1, price: 9.99 },
    { id: 'com.maitri.premium.quarterly', months: 3, price: 27.99 },
    { id: 'com.maitri.premium.biannual', months: 6, price: 49.99 },
    { id: 'com.maitri.premium.lifetime', months: 'lifetime', price: 99, label: 'One Time Payment' }
];

export default function LimitReachedScreen({ route, navigation }) {
    const { title = "Oh, you reached the limit." } = route.params;
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    useEffect(() => {
        const initIAP = async () => {
            try {
                await IAPService.init();
                const availableProducts = await IAPService.getAvailableSubscriptions();
                setProducts(availableProducts);
                if (availableProducts.length > 0) {
                    setSelectedProduct(availableProducts[0]); // Default to first product
                }
            } catch (error) {
                console.error('Error initializing IAP:', error);
                toast.show('Failed to load subscription options', { type: 'error' });
            }
        };

        initIAP();

        return () => {
            IAPService.cleanup();
        };
    }, []);

    const handlePurchase = async () => {
        if (!selectedProduct) {
            toast.show('No subscription plan selected', { type: 'error' });
            return;
        }

        setLoading(true);
        try {
            await IAPService.purchaseSubscription(selectedProduct.productId);
            toast.show('Thank you for subscribing!', { type: 'success' });
            navigation.goBack();
        } catch (error) {
            console.error('Purchase error:', error);
            toast.show('Purchase failed. Please try again.', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getEllipseStyles = () => {
        const screenWidth = Dimensions.get('window').width;
        const screenHeight = Dimensions.get('window').height;
        
        return {
            ellipse1: {
                position: 'absolute',
                width: screenWidth * 1.05,
                height: screenHeight * 0.55,
                left: screenWidth * -0.635,
                top: screenHeight * 0.65,
                backgroundColor: '#EDE3FE',
                borderRadius: screenHeight * 0.3
            },
            ellipse2: {
                position: 'absolute',
                width: screenWidth * 0.45,
                height: screenHeight * 0.26,
                left: screenWidth * 0.245,
                top: screenHeight * 0.8,
                backgroundColor: '#EDE3FE',
                borderRadius: screenHeight * 0.15
            },
            ellipse3: {
                position: 'absolute',
                width: screenWidth * 0.94,
                height: screenHeight * 0.49,
                left: screenWidth * 0.619,
                top: screenHeight * 0.71,
                backgroundColor: '#EDE3FE',
                borderRadius: screenHeight * 0.3
            }
        };
    };

    const ellipseStyles = getEllipseStyles();
    
    const features = [
        "Access to premium features",
        "Unlimited messages",
        "Priority support",
        "Ad-free experience"
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ArrowLeftIcon
                        width={18}
                        height={18}
                        style={styles.backIcon}
                        color="#000000"
                    />
                </TouchableOpacity>

                <Text style={styles.mainTitle}>
                    {title}
                </Text>
                <Text style={styles.mainTitleBold}>
                    Get more with Maitri Premium!
                </Text>

                <View style={styles.featuresList}>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <CheckIcon width={20} height={20} color="#000000" />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>

                {selectedProduct && (
                    <Text style={styles.pricingText}>
                        Get <Text style={styles.pricingTextBold}>Premium</Text> for{' '}
                        <Text style={styles.pricingTextBold}>{selectedProduct.localizedPrice}/mo</Text>
                    </Text>
                )}

                <TouchableOpacity 
                    style={[styles.continueButton, loading && styles.continueButtonDisabled]}
                    onPress={handlePurchase}
                    disabled={loading || !selectedProduct}
                >
                    {loading ? (
                        <ActivityIndicator color="#000000" />
                    ) : (
                        <Text style={styles.continueButtonText}>Continue</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.moreOptionsLink}
                    onPress={() => navigation.navigate('GetMore')}
                >
                    <Text style={styles.moreOptionsText}>See more options</Text>
                </TouchableOpacity>

                <View style={ellipseStyles.ellipse1} />
                <View style={ellipseStyles.ellipse2} />
                <View style={ellipseStyles.ellipse3} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#DCC7FF'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 20,
        position: 'relative'
    },
    backButton: {
        position: 'absolute',
        left: 26,
        top: 37,
        zIndex: 1
    },
    mainTitle: {
        width: 309,
        marginTop: 70,
        fontFamily: 'Poppins',
        fontSize: 20,
        fontWeight: '400',
        lineHeight: 24,
        textAlign: 'center',
        letterSpacing: -0.005,
        color: '#000000'
    },
    mainTitleBold: {
      fontFamily: 'Poppins',
            fontWeight: '600',
            marginTop: 0,
            fontSize: 20,
            lineHeight: 24,
            textAlign: 'center',
            letterSpacing: -0.005,
            color: '#000000'
            
        },
    featuresList: {
        width: 233,
        marginTop: 30,
        flexDirection: 'column',
        gap: 9,
        alignItems: 'flex-start',
        alignSelf: 'center'
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 3
    },
    featureText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        lineHeight: 21,
        color: '#000000'
    },
    pricingText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: '#000000',
        marginTop: 20
    },
    pricingTextBold: {
        fontFamily: 'Poppins',
        fontWeight: '600',
        color: '#000000'
    },
    continueButton: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000000'
    },
    continueButtonDisabled: {
        opacity: 0.5
    },
    continueButtonText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        fontWeight: '600',
        color: '#000000'
    },
    moreOptionsLink: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#000000',
        marginTop: 20
    },
    moreOptionsText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        fontWeight: '600',
        color: '#000000'
    },
    backgroundEllipse1: {
        position: 'absolute',
        width: 168,
        height: 171,
        left: 92,
        top: 529,
        backgroundColor: '#EDE3FE',
        zIndex: -1
    },
    backgroundEllipse2: {
        position: 'absolute',
        width: 395,
        height: 364,
        left: -238,
        top: 433,
        backgroundColor: '#EDE3FE',
        zIndex: -1
    },
    backgroundEllipse3: {
        position: 'absolute',
        width: 353,
        height: 326,
        left: 232,
        top: 471,
        backgroundColor: '#EDE3FE',
        zIndex: -1
    },
    backgroundLayers: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: -1
        },
    backIcon: {
        width: 18,
        height: 18
    }
});


