import { AppState, StatusBar, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { ThemeProvider } from '@shopify/restyle';
import theme from './src/utils/theme';
import Navigation from './src/navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SWRConfig } from 'swr';
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid } from 'react-native';
import { NavigationContainerRef, createNavigationContainerRef } from '@react-navigation/native';
import { RootBottomTabParamList } from './src/navigation/types';

// Tạo một tham chiếu điều hướng
const navigationRef = createNavigationContainerRef<RootBottomTabParamList>();

// Xử lý thông báo khi ứng dụng mở từ trạng thái nền
messaging().onNotificationOpenedApp(remoteMessage => {
  console.log(
    'Thông báo đã khiến ứng dụng mở từ trạng thái nền:',
    remoteMessage.notification,
  );
  
  if (navigationRef.isReady()) {
    navigationRef.navigate('Settings');
  }
});

// Xử lý thông báo khi ứng dụng đang hoạt động
messaging().onMessage(async remoteMessage => {
  console.log('Một thông báo FCM mới đã đến!', remoteMessage);
  if (navigationRef.isReady()) {
    navigationRef.navigate('Settings');
  }
});

// Xử lý thông báo khi ứng dụng ở chế độ nền hoặc bị đóng
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Thông báo được xử lý ở chế độ nền!', remoteMessage);
  if (navigationRef.isReady()) {
    navigationRef.navigate('Settings');
  }
});

const App = () => {
  useEffect(() => {
    const requestUserPermission = async () => {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Trạng thái cấp quyền:', authStatus);
        const token = await messaging().getToken();
        console.log('FCM token:', token);
      }
    };
    requestUserPermission();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <SWRConfig
          value={{
            provider: () => new Map(),
            isVisible: () => true,
            initFocus(callback) {
              let appState = AppState.currentState;

              const onAppStateChange = (nextAppState: any) => {
                /* Nếu nó chuyển từ nền hoặc chế độ không hoạt động sang chế độ hoạt động */
                if (appState.match(/inactive|background/) && nextAppState === 'active') {
                  callback();
                }
                appState = nextAppState;
              };

              // Đăng ký sự kiện thay đổi trạng thái ứng dụng
              const subscription = AppState.addEventListener('change', onAppStateChange);

              return () => {
                subscription.remove();
              };
            },
          }}
        >
          <Navigation ref={navigationRef} />
        </SWRConfig>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
