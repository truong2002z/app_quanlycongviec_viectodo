import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { CategoriesNavigationType } from "../../navigation/types";
import { Box, Text, Theme } from "../../utils/theme";
import Icon from "react-native-vector-icons/FontAwesome6Pro";

const CreateNewList = () => {
  const navigation = useNavigation<CategoriesNavigationType>();
  const theme = useTheme<Theme>();

  const navigateToCreateCategory = () => {
    navigation.navigate("CreateCategory", {});
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[styles.container,{}]}
      >
        <Icon  onPress={navigateToCreateCategory} name="plus" size={28} color={theme.colors.white} />
       
      </Pressable>
      </View>
     
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding:6,
  },
  container: {
    width: 60,
    height: 60,
    borderColor:'#be185d',
    borderWidth:1,
    backgroundColor:'#f9a8d4',
    borderRadius:50, 
    alignItems:"center",
    justifyContent:"center"
  },
});

export default CreateNewList;
