import { Alert, Platform } from 'react-native'

const alertPolyfill = (title, description, options = [], extra) => {
    // Default options if not provided
    if (options.length === 0) {
        options = [{ text: 'OK', onPress: () => {} }];
    }

    const result = window.confirm([title, description].filter(Boolean).join('\n'))

    if (result) {
        const confirmOption = options.find(({ style }) => style !== 'cancel') || options[0]
        confirmOption && confirmOption.onPress && confirmOption.onPress()
    } else {
        const cancelOption = options.find(({ style }) => style === 'cancel')
        cancelOption && cancelOption.onPress && cancelOption.onPress()
    }
}

const alert = Platform.OS === 'web' ? alertPolyfill : Alert.alert

export default alert
