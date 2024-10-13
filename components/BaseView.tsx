import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

export type BaseViewProps = {
  children: React.ReactNode;
  style?: object;
};

const BaseViewStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
});

export function BaseView({ children, style }: BaseViewProps) {
  const backgroundColor = useThemeColor({}, 'background');
  
  return (
    <SafeAreaView style={[BaseViewStyles.safeArea, { backgroundColor }]}>
      <View style={[BaseViewStyles.container, style]}>
        {children}
      </View>
    </SafeAreaView>
  );
}
