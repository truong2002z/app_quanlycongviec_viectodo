
import { Alert,  } from 'react-native'
import React, { useState } from 'react'
import { Box, Text } from '../../utils/theme'
import SafeAreaWrapper from '../../components/shared/safe-area-wrapper'
import LinearGradient from 'react-native-linear-gradient'
import Button from '../../components/shared/button'

import Input from '../../components/shared/input'
import axiosInstance from '../../services/config'
import NavigateBack from '../../components/shared/navigate-back'

const forgotPasswordRequest = async (email: string) => {
    try {
      const response = await axiosInstance.post('/users/forgot-password', {
        email: email,
      });
      console.log("Password reset email sent", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in forgotPasswordRequest", error);
      throw error;
    }
  };
const ForgotPassScreen = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async () => {
      if (!email) {
        Alert.alert('Vui lòng nhập email');
        return;
      }
  
      try {
        const response = await forgotPasswordRequest(email);
        Alert.alert('Thành công', 'Mật khẩu mới đã được gửi tới email của bạn');
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể gửi yêu cầu quên mật khẩu');
      }
    };
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
        <Box flex={1} justifyContent="flex-start" padding='5'>
            <NavigateBack/>
            <Text
                textAlign="center"
                fontWeight="700"
                color="purple1000"
                fontSize={30}
                marginBottom='5'
            >
                Quên mật khẩu?
            </Text>
            <Text fontSize={18}  textAlign='justify'>
                Vui lòng điền tài khoản email bạn đã đăng ký trên hệ thống.
                Chúng tôi sẽ gửi thư xác nhận và tiến hành đặt lại mật khẩu cho bạn.
            </Text>
            <Box mb='6'/>
            <Input
                label="Email"
                placeholder="Nhập vào email của bạn"
                value={email}
                onChangeText={setEmail}
            />
            <Box mb="5.5" />
            <Button label='Gửi' onPress={handleSubmit} uppercase />
        </Box>
        </LinearGradient>
        </SafeAreaWrapper>
    )
}

export default ForgotPassScreen