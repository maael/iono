import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Platform, Clipboard, ToastAndroid, Linking } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Sentry from 'sentry-expo';

Sentry.init({
  dsn: 'https://8875fc6f6659404a8cc4a54e3e69cc94@o304997.ingest.sentry.io/5480877',
  enableInExpoDevelopment: false,
});

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false
    })
  }
})

function useRegisterForPushNotifications() {
  const [pushToken, setPushToken] = useState('');
  const [error, setError] = useState<string>();
  useEffect(() => {
    (async () => {
      if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          setError('Failed to get push token for push notification!');
          return;
        }
        const token = await Notifications.getExpoPushTokenAsync();
        setPushToken(token.data.replace(/^ExponentPushToken\[/, '').replace(/\]$/, ''));
      } else {
        setError('Must use physical device for Push Notifications');
        return;
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    })()
  }, [])
  return [pushToken, error]
}

function useNotificationHandler () {
  const responseListener = useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener>>();
  const notificationListener = useRef<ReturnType<typeof Notifications.addNotificationReceivedListener>>();
  const lastHandled = useRef<string>();
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(async (notification) => {
      lastHandled.current = notification.request.identifier;
      await Notifications.dismissAllNotificationsAsync();
      if (notification.request.content.data.url) {
        ToastAndroid.showWithGravityAndOffset('Redirecting you now!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 50)
        setTimeout(() => {
          console.info('Opening', notification.request.content.data.url);
          Linking.openURL(notification.request.content.data.url as string);
        }, 1000)
      } else {
        ToastAndroid.showWithGravityAndOffset('No link to send you to!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 50)
      }
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(async (res) => {
      if (res.notification.request.content.data.url) {
        if (res.notification.request.identifier === lastHandled.current) {
          await Notifications.dismissAllNotificationsAsync();
          return;
        }
        ToastAndroid.showWithGravityAndOffset('Redirecting you now!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 50)
        setTimeout(() => {
          console.info('Opening', res.notification.request.content.data.url);
          Linking.openURL(res.notification.request.content.data.url as string);
        }, 1000)
      } else {
        ToastAndroid.showWithGravityAndOffset('No link to send you to!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 50)
      }
      lastHandled.current = res.notification.request.identifier;
    });
    return () => {
      if (responseListener.current) Notifications.removeNotificationSubscription(responseListener.current)
      if (notificationListener.current) Notifications.removeNotificationSubscription(notificationListener.current)
    }
  }, [])
}

export default function App() {
  const [token, error] = useRegisterForPushNotifications();
  useNotificationHandler();
  return (
    <View style={styles.container}>
      <View style={[styles.circle, styles.ionosphere]}></View>
      <View style={[styles.circle, styles.atmosphere]}></View>
      <View style={[styles.circle, styles.planet]}></View>

      <Text style={[styles.text, styles.titleText]}>Iono</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.text} >✨ The magic, tap to copy ✨</Text>
        <Text style={styles.text} onPress={() => {
          if (token) {
            Clipboard.setString(token)
            ToastAndroid.showWithGravityAndOffset('📋 Copied!', ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 50)
          }
        }}>{token}</Text>
        <Text style={styles.text} >Use this code to get a magic link on</Text>
        <Text style={[styles.text, styles.link]} onPress={() => Linking.openURL('https://iono.mael.tech')}>https://iono.mael.tech</Text>
        {error ? <Text style={[styles.text, styles.errorText]}>Error: {error}</Text> : null}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: { position: 'absolute', top: 75, fontSize: 50 },
  contentContainer: {
    height: '60%', position: 'absolute', bottom: 0, alignItems: 'center', justifyContent: 'center'
  },
  circle: {
    width: 1500, height: 1500, position: 'absolute', borderRadius: 1500
  },
  planet: {
    top: 255,
    backgroundColor: '#0F82AF',
  },
  atmosphere: {
    top: 225,
    backgroundColor: '#8E8DA4',
  },
  ionosphere: {
    top: 175,
    backgroundColor: '#5B5D7A',
  },
  text: {
    color: '#f0f0f7',
    marginVertical: 10,
    maxWidth: '85%'
  },
  link: {
    color: '#B3D561',
    textDecorationLine: 'underline'
  },
  errorText: {
    color: '#fea04f',
  }
});
