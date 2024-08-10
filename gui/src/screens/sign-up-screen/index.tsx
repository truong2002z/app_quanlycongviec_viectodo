import { Pressable, View, Alert, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Box, Text } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { AuthScreenNavigationType } from '../../navigation/types';
import SafeAreaWrapper from '../../components/shared/safe-area-wrapper';
import Input from '../../components/shared/input';
import Button from '../../components/shared/button';
import { Controller, useForm } from 'react-hook-form';
import { IUser } from '../../types';
import { registerUser } from '../../services/api';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import messaging from '@react-native-firebase/messaging';

export const useDeviceToken = () => {
    const [deviceToken, setDeviceToken] = useState<string>('');

    useEffect(() => {
        const requestUserPermission = async () => {
            const authStatus = await messaging().requestPermission();
            const token = await messaging().getToken();
            console.log('FCM token:', token);
            setDeviceToken(token);
        };
        requestUserPermission();
    }, []);

    return deviceToken;
};

const SignUpScreen = () => {
    const navigation = useNavigation<AuthScreenNavigationType<"SignUp">>();
    const navigationToSignInScreen = () => {
        navigation.navigate('SignIn');
    };

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<IUser & { confirmPassword: string }>({
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
        },
    });

    const deviceToken = useDeviceToken();

    const onSubmit = async (data: IUser & { confirmPassword: string }) => {
        try {
            const { email, name, password, confirmPassword } = data;
    
            if (password !== confirmPassword) {
                Alert.alert('Lỗi', 'Mật khẩu không khớp. Vui lòng kiểm tra lại.');
                return;
            }
            
            await registerUser({ email, name, password, deviceToken });
            
            Alert.alert(
                'Thành công',
                'Đăng ký thành công!',
                [{ text: 'OK', onPress: navigationToSignInScreen }],
                { cancelable: false }
            );
            console.log('user:', name);
            
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                Alert.alert('Lỗi', 'Email này đã được đăng ký. Vui lòng sử dụng email khác.');
            } else {
                Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
           // console.error(error);
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
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <Box height={16} />
                        <Box flex={1} px="5.5" mt={"2"}>
                            <Text variant="textXl" fontWeight="700" mb="6" style={{ textAlign: 'center' }}>
                                Đăng Ký
                            </Text>
                            <Box mb='6' />
                            <Controller
                                control={control}
                                rules={{
                                    required: "Email không được bỏ trống",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Email không đúng định dạng",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        label="Tài khoản"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Email"
                                    />
                                )}
                                name="email"
                            />
                            {errors.email && (
                                <Text color="red500" textAlign="left">
                                    {errors.email.message}
                                </Text>
                            )}
                            <Box mb="6" />
                            <Controller
                                control={control}
                                rules={{
                                    required: "Tên người dùng không được bỏ trống",
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input
                                        label="Tên người dùng"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Tên người dùng"
                                    />
                                )}
                                name="name"
                            />
                            {errors.name && (
                                <Text color="red500" textAlign="left">
                                    {errors.name.message}
                                </Text>
                            )}
                            <Box mb="6" />
                            <View style={{ position: 'relative' }}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: "Mật khẩu không được bỏ trống",
                                        minLength: {
                                            value: 6,
                                            message: "Mật khẩu phải có ít nhất 6 ký tự",
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            label="Mật khẩu"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Mật khẩu"
                                            secureTextEntry={!passwordVisible}
                                        />
                                    )}
                                    name="password"
                                />
                                {errors.password && (
                                    <Text color="red500" textAlign="left">
                                        {errors.password.message}
                                    </Text>
                                )}
                                <TouchableOpacity
                                    onPress={togglePasswordVisibility}
                                    style={{
                                        position: 'absolute',
                                        right: 10,
                                        top: 35,
                                    }}
                                >
                                    <Icon style={{ padding: 15 }} name={passwordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" />
                                </TouchableOpacity>
                            </View>
                            <Box mb="6" />
                            <View style={{ position: 'relative', justifyContent: "center" }}>
                                <Controller
                                    control={control}
                                    rules={{
                                        required: "Xác nhận mật khẩu không được bỏ trống",
                                        validate: value => value === watch('password') || 'Mật khẩu không khớp',
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input
                                            label="Xác nhận mật khẩu"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            placeholder="Xác nhận mật khẩu"
                                            secureTextEntry={!confirmPasswordVisible}
                                        />
                                    )}
                                    name="confirmPassword"
                                />
                                {errors.confirmPassword && (
                                    <Text color="red500" textAlign="left">
                                        {errors.confirmPassword.message}
                                    </Text>
                                )}
                                <TouchableOpacity
                                    onPress={toggleConfirmPasswordVisibility}
                                    style={{
                                        position: 'absolute',
                                        right: 10,
                                        top: 35,
                                    }}
                                >
                                    <Icon style={{ padding: 15 }} name={confirmPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" />
                                </TouchableOpacity>
                            </View>
                            <Box mb="10" />
                            <Button label='Đăng Ký' onPress={handleSubmit(onSubmit)} uppercase />
                            <Box mt="3" />
                            <Pressable onPress={navigationToSignInScreen}>
                                <Text color="purple1000" textAlign="center" fontSize={16}>
                                    Đăng nhập
                                </Text>
                            </Pressable>
                        </Box>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaWrapper>
    );
};

export default SignUpScreen;
