import {Platform} from 'react-native';

export const themeColor = '#1C4837';
export const lightThemeColor = '#ffffff';

export function getTheme() {
  const disabledColor = '#808080';

  return {
    // arrows
    arrowColor: '#000',
    arrowStyle: {
        padding: 0,
    },
    // knob
    expandableKnobColor: '#C7C7C7',
    // month
    monthTextColor: '#000',
    textMonthFontSize: 18,
    textMonthFontFamily: 'poppins-medium',
    textMonthFontWeight: '500',
    // day names
    textSectionTitleColor: '#000',
    textDayHeaderFontSize: 12,
    textDayHeaderFontFamily: 'poppins-regular',
    textDayHeaderFontWeight: '400',
    // dates
    dayTextColor: '#000',
    todayTextColor: '#26847B',
    textDayFontSize: 14,
    textDayFontFamily: 'poppins-medium',
    textDayFontWeight: '500',
    textDayStyle: {marginTop: Platform.OS === 'android' ? 2 : 4},
    // selected date
    selectedDayBackgroundColor: themeColor,
    selectedDayTextColor: '#fff',
    // disabled date
    textDisabledColor: disabledColor,
    // dot (marked date)
    dotColor: themeColor,
    selectedDotColor: '#fff',
    disabledDotColor: disabledColor,
    dotStyle: {marginTop: -2}
  };
}