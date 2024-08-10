import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Box, Text } from '../../utils/theme';
import LinearGradient from 'react-native-linear-gradient';

type ButtonProps = {
  label: string;
  onPress: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  uppercase?: boolean;
};

const Button = ({
  label,
  onPress,
  onLongPress,
  disabled = false,
  uppercase = false,
}: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.buttonContainer,
        { opacity: pressed || disabled ? 0.7 : 1 },
      ]}
    >
      <LinearGradient
        colors={['#e879f9', '#DB3AFF', '#DB3AFF', '#e879f9' ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Box style={styles.button}>
          <Text
            style={[
              styles.text,
              { textTransform: uppercase ? 'uppercase' : 'none' },
            ]}
          >
            {label}
          </Text>
        </Box>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
  },
  gradient: {
    borderRadius: 50,
    padding: 1,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
});

export default Button;