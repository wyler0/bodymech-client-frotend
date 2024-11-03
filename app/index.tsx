import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import auth from '@react-native-firebase/auth';
import { FirebaseUser } from '../api/types/firebase';

// Used to set the default route to the growth dashboard
export default function Index() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user: FirebaseUser | null) => {
            setIsAuthenticated(!!user);
        });
        
        return unsubscribe;
    }, []);

    if (isAuthenticated === null) {
        // Show a loading screen while checking authentication status
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    }
    
    if (isAuthenticated) {
        // Redirect to the growth dashboard when authenticated
        return <Redirect href="/(tabs)/(growth dashboard)" />;
    } else {
        // Redirect to login when not authenticated
        return <Redirect href="/(login)" />;
    }
}
