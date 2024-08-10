import React from "react";
import Icon from 'react-native-vector-icons/Entypo';
import { Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FadeInRight, FadeInLeft } from "react-native-reanimated";
import { CategoriesNavigationType } from "../../navigation/types";
import { ICategory } from "../../types";
import { AnimatedBox, Box, Text } from "../../utils/theme";

type CategoryProps = {
  category: ICategory;
};

const Category = ({ category }: CategoryProps) => {
  const navigation = useNavigation<CategoriesNavigationType>();

  const navigateToCreateCategory = () => {
    navigation.navigate("CreateCategory", {
      category: category,
    });
  };

  const navigateToCategoryScreen = () => {
    navigation.navigate("Category", {
      id: category._id,
    });
  };

  return (
    <AnimatedBox entering={FadeInRight} exiting={FadeInLeft}>
      <Pressable onPress={navigateToCategoryScreen}>
        <Box
          bg="white"
          p="4"
          borderRadius="rounded-3xl"
          shadowColor="gray500"
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.2}
          shadowRadius={8}
          mb="3"
          style={styles.container}
        >
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box flexDirection="row" alignItems="center">
              <Text variant="textBase" fontWeight="700" mr="3" fontSize={20}>
                {category.icon.symbol}
              </Text>
              <Text variant="textBase" fontWeight="600" color="gray650" fontSize={18}>
                {category.name}
              </Text>
            </Box>
            <Pressable onPress={navigateToCreateCategory}>
              <Icon name="dots-three-vertical" size={24} color="#6b7280" />
            </Pressable>
          </Box>
        </Box>
      </Pressable>
    </AnimatedBox>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#f472b6',
  },
});

export default Category;
