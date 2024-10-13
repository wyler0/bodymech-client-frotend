import Constants from 'expo-constants';

export const getConfig = () => ({
  apiUrl: Constants.expoConfig?.extra?.apiUrl as string,
  useSampleData: Constants.expoConfig?.extra?.useSampleData as boolean,
});

