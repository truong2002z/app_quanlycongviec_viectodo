
import React from "react"
import { ActivityIndicator, Text } from "react-native"
import SafeAreaWrapper from "./safe-area-wrapper"
import { Box } from "../../utils/theme"

const Loader = () => {
  return (
    <SafeAreaWrapper>
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text>Xin vui lòng chờ</Text>
        <ActivityIndicator />
      </Box>
    </SafeAreaWrapper>
  )
}

export default Loader
