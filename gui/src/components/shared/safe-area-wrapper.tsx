
import React, { ReactNode } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import theme from "../../utils/theme"
import LinearGradient from "react-native-linear-gradient"

type SafeAreaWrapperProps = {
  children: ReactNode
}

const SafeAreaWrapper = ({ children }: SafeAreaWrapperProps) => {
  return (
    <LinearGradient
    colors={[
      "#ffffff",
      "#fcecff",
      "#f8daff",
      "#fae2ff",
      "#fae2ff",
      "#fcecff",
      "#ffffff",
    ]}
    style={{ flex: 1 }}
  >

    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      {children}
    </SafeAreaView>
    </LinearGradient>
  )
}

export default SafeAreaWrapper
