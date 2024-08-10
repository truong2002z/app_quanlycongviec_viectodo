
import { Image, Pressable, View, } from 'react-native'
import React from 'react'
import { Box, Text } from '../../utils/theme'
import { useNavigation } from '@react-navigation/native'
import { AuthScreenNavigationType } from '../../navigation/types'
import SafeAreaWrapper from '../../components/shared/safe-area-wrapper'
import LinearGradient from 'react-native-linear-gradient'
import Button from '../../components/shared/button'


const WelcomeScreen = () => {

    const navigation = useNavigation<AuthScreenNavigationType<"Welcome">>()
    const navigationToSignInScreen = () => {
        navigation.navigate('SignIn')
    }
    const navigationToSignUpScreen = () => {
        navigation.navigate('SignUp')
    }

    return (
        <SafeAreaWrapper>
            <LinearGradient
            colors={[
                "#ffffff",
                "#fcecff",
                "#f8daff",
                "#fae2ff",
                "#fae2ff",
                "#ffffff",
              ]}
            style={{ flex: 1 }}
            >
        <Box flex={1} justifyContent="center">
            <Box alignItems='center' mb="3.5">
            <Image
                    source={require('../../image/logo.png')}

              />
            </Box>
            <Box my="3.5" mx="10">
            <Button
              label="Đăng Nhập"
              onPress={navigationToSignInScreen}
            />

          </Box>
          <Pressable onPress={navigationToSignUpScreen}>
          <Text
            textAlign="center"
            variant="textXs"
            fontWeight="700"
            fontSize={14}
            color="purple1000"
          >
            Đăng ký ngay
          </Text>
          </Pressable>
        </Box>
        </LinearGradient>
        </SafeAreaWrapper>
    )
}

export default WelcomeScreen