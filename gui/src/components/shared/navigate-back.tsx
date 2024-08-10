
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { Pressable } from "react-native"

import { useTheme } from "@shopify/restyle"
import  Icon  from "react-native-vector-icons/Ionicons"
import { Box, Theme } from "../../utils/theme"

const NavigateBack = () => {
  const navigation = useNavigation()
  const theme = useTheme<Theme>()
  const navigateBack = () => {
    navigation.goBack()
  }
  return (
    <Pressable onPress={navigateBack}>
      <Box bg="fuchsia100" style={{width:40, alignContent:'center'}} p="2" borderRadius="rounded-7xl">
        <Icon name="chevron-back" size={24} color={theme.colors.fuchsia500} />
      </Box>
    </Pressable>
  )
}

export default NavigateBack
