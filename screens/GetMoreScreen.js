import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import CheckIcon from '../assets/icons/check-icon.svg';
import XIcon from '../assets/icons/ph-x-light.svg';
import { Dimensions, Image } from 'react-native';
import MimiImage from '../assets/img/mimi-flower-illustration.png';
import IAPService from '../services/IAPService';
import { useToast } from 'react-native-toast-notifications';


export default function GetMoreScreen({ navigation }) {
    const [selectedSubscription, setSelectedSubscription] = React.useState(6); // Default 6 months selected
    const toast = useToast();

    const features = [
        "Unlimited tasks",
        "Unlimited supporters",
        "Personal AI companion"
    ];

    const subscriptions = [
        { months: 1, price: 9.99, total: 9.99 },
        { months: 3, price: 9.33, total: 27.99 },
        { months: 6, price: 8.33, total: 49.99 }
    ];
    
    const handleSubscriptionSelect = async (months) => {
        try {
            console.log(`Selected subscription: ${months} months`);
            setSelectedSubscription(months);
            
            // Meghatározzuk a megfelelő product ID-t
            let productId;
            switch(months) {
                case 1:
                    productId = 'com.maitri.premium.monthly';
                    break;
                case 3:
                    productId = 'com.maitri.premium.quarterly';
                    break;
                case 6:
                    productId = 'com.maitri.premium.biannual';
                    break;
                default:
                    console.error('Invalid subscription period');
                    return;
            }

            // Elindítjuk a vásárlást
            const result = await IAPService.purchaseSubscription(productId);
            console.log('Purchase result:', result);
            
            if (result.success) {
                toast.show('Thank you for subscribing!', { type: 'success' });
                navigation.goBack();
            } else {
                toast.show('Purchase was not completed', { type: 'error' });
            }
        } catch (error) {
            console.error('Purchase error:', error);
            toast.show('Purchase failed. Please try again.', { type: 'error' });
        }
    };

    const handleLifetimeSelect = async () => {
        try {
            console.log('Selected lifetime subscription');
            setSelectedSubscription('lifetime');
            
            // Elindítjuk a lifetime előfizetés vásárlását
            const result = await IAPService.purchaseSubscription('com.maitri.premium.lifetime');
            console.log('Purchase result:', result);
            
            if (result.success) {
                toast.show('Thank you for subscribing!', { type: 'success' });
                navigation.goBack();
            } else {
                toast.show('Purchase was not completed', { type: 'error' });
            }
        } catch (error) {
            console.error('Purchase error:', error);
            toast.show('Purchase failed. Please try again.', { type: 'error' });
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
                },
                ellipseTop: {
                            position: 'absolute',
                            width: screenWidth * 1.8,
                            height: screenHeight * 0.5,
                            left: '50%',
                            transform: [{ translateX: -screenWidth * 0.9 }],
                            top: -screenHeight * 0.12,
                            backgroundColor: '#EDE3FE',
                            borderRadius: screenWidth * 0.5,
                            zIndex: -1
                        }
            };
        };
    
    
        const ellipseStyles = getEllipseStyles();

    return (
        <View style={styles.container}>
          <View style={ellipseStyles.ellipseTop} />
          <View style={ellipseStyles.ellipse1} />
          <View style={ellipseStyles.ellipse2} />
          <View style={ellipseStyles.ellipse3} />
          <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
          >
              <View style={styles.closeButtonContainer}>
                  <XIcon width={15} height={15} color="#000000" />
              </View>
          </TouchableOpacity>

            <Text style={styles.title}>
                Get more with Maitri Premium!
            </Text>

            <View style={styles.featuresContainer}>
                <View style={styles.featuresList}>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <CheckIcon width={20} height={20} color="#000000" />
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <ScrollView style={styles.subscriptionContainer}>
                {subscriptions.map((sub, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={[
                            styles.subscriptionButton,
                            selectedSubscription === sub.months && styles.selectedSubscription
                        ]}
                        onPress={() => handleSubscriptionSelect(sub.months)}
                    >
                        <View style={styles.subscriptionInfo}>
                            <Text style={styles.monthText}>
                                {sub.months} {sub.months === 1 ? 'month' : 'months'}
                            </Text>
                            <Text style={styles.totalText}>
                                total ${sub.total}
                            </Text>
                        </View>
                        <Text style={styles.priceText}>
                            ${sub.price}/mo
                        </Text>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity 
                    style={[
                        styles.subscriptionButton,
                        selectedSubscription === 'lifetime' && styles.selectedSubscription
                    ]}
                    onPress={handleLifetimeSelect}
                >
                    <View style={styles.subscriptionInfo}>
                        <Text style={styles.monthText}>Lifetime</Text>
                        <Text style={styles.totalText}>One time payment</Text>
                    </View>
                    <Text style={styles.priceText}>$99</Text>
                </TouchableOpacity>
            </ScrollView>
            <Image 
                    source={MimiImage}
                    style={styles.mimiImage}
                />
            <TouchableOpacity style={styles.restorePurchase}>
                <Text style={styles.restoreText}>restore purchase</Text>
            </TouchableOpacity>
            
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
          flex: 1,
          backgroundColor: '#DCC7FF',
          padding: 20,
          alignItems: 'center'
      },
      closeButton: {
              position: 'absolute',
              right: 30,
              top: 56,
              zIndex: 1
          },
          closeButtonContainer: {
              width: 15,
              height: 15,
              alignItems: 'center',
              justifyContent: 'center'
          },
      title: {
          width: 309,
          marginTop: 70,
          fontFamily: 'Poppins',
          fontSize: 20,
          fontWeight: '600',
          lineHeight: 24,
          textAlign: 'center',
          letterSpacing: -0.005,
          color: '#000000'
      },
      featuresContainer: {
              width: '100%',
              alignItems: 'center',
              marginTop: 30
          },
          featuresList: {
              width: 191,
              flexDirection: 'column',
              gap: 9,
          },
          featureItem: {
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingVertical: 3,
          },
          featureText: {
              fontFamily: 'Poppins',
              fontSize: 14,
              lineHeight: 21,
              color: '#000000'
          },
    subscriptionContainer: {
            marginTop: 30,
            width: 327,
            alignSelf: 'center',
            zIndex: 1
        },
    subscriptionButton: {
        width: '100%',
        height: 78,
        backgroundColor: '#FFFFFF',
        borderRadius: 87,
        marginBottom: 10,
        padding: 22,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectedSubscription: {
        backgroundColor: '#EDE3FE',
        borderWidth: 2,
        borderColor: '#9747FF'
    },
    subscriptionInfo: {
        gap: 3
    },
    mimiImage: {
            position: 'absolute',
            width: 116,
            height: 108,
            bottom: 76,
        },
    monthText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 17,
        letterSpacing: -0.005,
        textTransform: 'capitalize',
        color: '#000000'
    },
    totalText: {
        fontFamily: 'Poppins',
        fontSize: 12,
        fontWeight: '300',
        lineHeight: 15,
        letterSpacing: -0.005,
        textTransform: 'capitalize',
        color: '#737373'
    },
    priceText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 17,
        letterSpacing: -0.005,
        textTransform: 'capitalize',
        color: '#9747FF'
    },
    restorePurchase: {
            position: 'absolute',
            bottom: 38,
            alignSelf: 'center',
            zIndex: 1
        },
    restoreText: {
        fontFamily: 'Poppins',
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 18,
        textDecorationLine: 'underline',
        textTransform: 'capitalize',
        color: '#000000'
    }
});
