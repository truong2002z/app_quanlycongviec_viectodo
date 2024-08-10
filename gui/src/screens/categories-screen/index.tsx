import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import useSWR from "swr";
import { ICategory } from "../../types";
import { fetcher } from "../../services/config";
import Loader from "../../components/shared/loader";
import Category from "../../components/categories/category";
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper";
import { Box, Text } from "../../utils/theme";
import CreateNewList from "../../components/categories/create-new-list";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 

const CategoriesScreen = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { data, isLoading } = useSWR<ICategory[]>(
    "categories/",
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  if (isLoading) {
    return <Loader />;
  }

  // Sắp xếp danh mục theo thời gian tạo, danh mục mới nhất sẽ ở đầu
  const sortedData = data?.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Lọc danh mục dựa trên truy vấn tìm kiếm
  const filteredData = sortedData?.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: ICategory }) => (
    <Category category={item} />
  );

  return (
    <SafeAreaWrapper>
      <Box flex={1} px="4">
        <Box height={16} />
        <Text variant="textXl" fontWeight="700" mb="10">
          Danh sách danh mục
        </Text>
        <View style={styles.headerContainer}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={24} color="#f472b6" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm công việc"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        <FlatList
          data={filteredData}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Box />}
          keyExtractor={(item) => item._id}
        />
        <CreateNewList />
        <Box height={24} />
      </Box>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 40,
    borderColor: '#f0abfc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fdf2f8', // Light background color
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.2, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 2, // For Android shadow
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },
});

export default CategoriesScreen;
