import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native';

// Used to set the default route to the growth dashboard
export default function Index() {
    return <Redirect href="/(tabs)/(growth dashboard)" />;
}
