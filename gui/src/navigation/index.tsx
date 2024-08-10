
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import React, { forwardRef } from "react"
import AppStackNavigator from "./app-stack-navigator"
import AuthStackNavigator from "./auth-stack-navigator"
import useUserGlobalStore from "../store/useUserGlobalStore"
import { RootBottomTabParamList } from "./types"

const Navigation = forwardRef<NavigationContainerRef<RootBottomTabParamList>, any>((props, ref) => {
  const { user } = useUserGlobalStore()
  

  return (
    <NavigationContainer ref={ref}>
      {/* <AuthStackNavigator /> */}
      {user ? <AppStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  )
})

export default Navigation
