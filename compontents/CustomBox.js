import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BubblesImg1 from '../assets/img/bubbles-bg-1.svg';
import BubblesImg2 from '../assets/img/bubbles-bg-2.svg';
import BubblesImg3 from '../assets/img/bubbles-bg-3.svg';
import BubblesImg4 from '../assets/img/bubbles-bg-4.svg';
import AppButton from './Button';

export default function CustomBox({ title, subtitle, largerText, secondSubtitle, buttons, bgColor, bgImg, bgImgColor }) {
    const hasContent = subtitle || largerText || secondSubtitle || (buttons && buttons.length > 0);

    return (
        <View style={[stylesBox.container, { backgroundColor: bgColor }]}>
            {bgImgColor &&
                <View style={stylesBox.bgImgWrapper}>
                    {bgImg ? (
                        <>
                            {bgImg === 1 &&
                                <BubblesImg1 style={[stylesBox.bgImg, { color: bgImgColor }]} width={420} height={420} />
                            }
                            {bgImg === 2 &&
                                <BubblesImg2 style={[stylesBox.bgImg, { color: bgImgColor }]} width={420} height={420} />
                            }
                            {bgImg === 3 &&
                                <BubblesImg3 style={[stylesBox.bgImg, { color: bgImgColor }]} width={420} height={420} />
                            }
                            {bgImg === 4 &&
                                <BubblesImg4 style={[stylesBox.bgImg, { color: bgImgColor }]} width={420} height={420} />
                            }
                        </>
                    ) : (
                        <BubblesImg1 style={[stylesBox.bgImg, { color: bgImgColor }]} width={420} height={420} />
                    )
                    }
                </View>
            }
            {hasContent ? (
                <View style={stylesBox.content}>
                    <View style={stylesBox.topTexts}>
                        <Text style={stylesBox.title}>{title}</Text>
                        {subtitle && <Text style={stylesBox.subtitle}>{subtitle}</Text>}
                    </View>
                    {(largerText || secondSubtitle) && (
                        <View style={stylesBox.middleTexts}>
                            <Text style={stylesBox.largerText}>{largerText}</Text>
                            <Text style={stylesBox.subtitle}>{secondSubtitle}</Text>
                        </View>
                    )}
                    {buttons && (
                        <View style={stylesBox.buttonContainer}>
                            {buttons.map((button, index) => (
                                <AppButton
                                    key={index}
                                    buttonSmall={true}
                                    buttonStyle={button.bgColor ? { backgroundColor: button.bgColor } : null}
                                    textStyle={button.textColor ? { color: button.textColor } : null}
                                    title={button.title}
                                />
                            ))}
                        </View>
                    )}
                </View>
            ) : (
                <View style={[stylesBox.content, stylesBox.customContent]}>
                    <Text style={stylesBox.title}>{title}</Text>
                </View>
            )}
        </View>
    );
}

const stylesBox = StyleSheet.create({
    container: {
        padding: 18,
        borderRadius: 20,
        marginVertical: 25,
        marginHorizontal: 8,
        position: 'relative',
        overflow: 'hidden',
        minWidth: 210,
        minHeight: 180,
    },
    content: {
        flexGrow: 1,
        flexShrink: 0,
        justifyContent: 'flex-end',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 15,
        position: 'relative',
        zIndex: 2,
    },
    customContent: {
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'poppins-medium',
        lineHeight: 18,
        color: '#000',
        marginBottom: 2,
        textAlign: 'center',
        maxWidth: 180,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
        fontFamily: 'poppins-medium',
        color: '#000',
        opacity: 0.5,
        lineHeight: 16,
        textAlign: 'center',
        maxWidth: 180,
    },
    largerText: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'poppins-semibold',
        marginBottom: 5,
        textAlign: 'center',
        maxWidth: 180,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 5,
    },
    bgImgWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
    },
    bgImg: {
        marginTop: -120,
        marginLeft: -105,
    }
});