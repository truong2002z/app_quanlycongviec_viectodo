import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useState, useMemo } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import useSWR from "swr";
import { CategoriesStackParamList } from "../../navigation/types";
import { ICategory, ITask } from "../../types";
import { fetcher } from "../../services/config";
import Loader from "../../components/shared/loader";
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper";
import { Box, Text } from "../../utils/theme";
import NavigateBack from "../../components/shared/navigate-back";
import TaskActions from "../../components/tasks/task-actions";
import Task from "../../components/tasks/task";
import { format } from "date-fns-tz";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type CategoryScreenRouteProp = RouteProp<CategoriesStackParamList, "Category">;

const CategoryScreen = () => {
  const route = useRoute<CategoryScreenRouteProp>();
  const { id } = route.params;
  const initialFilter = (route.params as { filter?: string })?.filter || "Hôm nay";
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState(initialFilter);

  const { data: category, isLoading: isLoadingCategory } = useSWR<ICategory>(
    `categories/${id}`,
    fetcher
  );

  const { data: tasks, isLoading: isLoadingTasks, mutate: mutateTasks } = useSWR<ITask[]>(
    `tasks/tasks-by-category/${id}`,
    fetcher,
    { refreshInterval: 1000 }
  );

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    const todayDate = new Date();
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(todayDate.getDate() - 1);

    const updatedTasks = tasks.map(task => ({
      ...task,
      isOverdue: new Date(task.date) < yesterdayDate && !task.isCompleted,
    }));

    let filtered = updatedTasks.filter(task =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (currentFilter) {
      case "Hôm nay":
        filtered = filtered.filter(
          task => format(new Date(task.date), "yyyy-MM-dd") === format(todayDate, "yyyy-MM-dd")
        );
        break;
      case "Ngày mai":
        const tomorrow = new Date(todayDate);
        tomorrow.setDate(todayDate.getDate() + 1);
        filtered = filtered.filter(
          task => format(new Date(task.date), "yyyy-MM-dd") === format(tomorrow, "yyyy-MM-dd")
        );
        break;
      case "Quá hạn":
        filtered = filtered.filter(task => task.isOverdue);
        break;
      case "Tất cả":
        filtered = filtered.filter(task => !task.isOverdue);
        break;
    }

    return filtered.sort((a, b) => {
      if (a.isCompleted && !b.isCompleted) return 1;
      if (!a.isCompleted && b.isCompleted) return -1;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [tasks, searchQuery, currentFilter]);

  if (isLoadingCategory || isLoadingTasks || !category || !tasks) {
    return <Loader />;
  }

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box width={40}>
          <NavigateBack />
        </Box>
        <Box height={16} />
        <Box flexDirection="row" alignItems="center">
          <Text variant="textXl" fontWeight="700">
            {category.icon.symbol}
          </Text>
          <Text variant="textXl" fontWeight="700" ml="3" style={{ color: category.color.code }}>
            {category.name}
          </Text>
        </Box>
        <Box height={8} />
        <Text variant="textBase" fontWeight="500" color="gray600">
          {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
        </Text>
        <Box height={16} />
        <TaskActions categoryId={id} />
        <Box height={16} />
        <View style={styles.filterContainer}>
          {["Tất cả", "Hôm nay", "Ngày mai", "Quá hạn"].map(filter => (
            <Pressable
              key={filter}
              style={[
                styles.filterButton,
                { backgroundColor: currentFilter === filter ? "#d946e9" : "#e884f5" },
              ]}
              onPress={() => setCurrentFilter(filter)}
            >
              <Text style={styles.filterText}>{filter}</Text>
            </Pressable>
          ))}
        </View>

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
          data={filteredTasks}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <Task task={item} mutateTasks={mutateTasks} />}
          ItemSeparatorComponent={() => <Box height={0} />}
          initialNumToRender={10}
          showsVerticalScrollIndicator={false}
        />
      </Box>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    marginHorizontal: 2,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: {
    color: "white",
    textAlign: "center",
  },
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

export default CategoryScreen;
