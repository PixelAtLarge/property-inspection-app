import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen = ({navigation}: Props) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <View style={styles.titleContainer}>
          <Text style={styles.titleDark}>Site</Text>
          <Text style={styles.titleGreen}>360</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/property_featured.jpg')}
            style={styles.houseImage}
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 100,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '400',
    color: '#1e293b',
    marginBottom: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: -8,
    marginBottom: 60,
  },
  titleDark: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1e3a5f',
  },
  titleGreen: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1e3a5f',
  },
  imageContainer: {
    width: 300,
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  houseImage: {
    width: '100%',
    height: '100%',
  },
  getStartedButton: {
    backgroundColor: '#1e3a5f',
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
});

export default WelcomeScreen;
