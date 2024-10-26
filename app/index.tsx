import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getAuth } from '../firebase';
import { FirebaseUser } from '../api/types/firebase';

// Used to set the default route to the growth dashboard
export default function Index() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const authInstance = getAuth();
        if (authInstance) {
            const unsubscribe = authInstance.onAuthStateChanged((user: FirebaseUser | null) => {
                setIsAuthenticated(!!user);
            });
            return unsubscribe;
        } else {
            console.error('Auth instance not found');
        }
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
        return <Redirect href="/(tabs)/(growth dashboard)" />;
    } else {
        return <Redirect href="/(login)" />;
    }
}
