import React, { useState, useMemo } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import useSWR from "swr";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { ITask } from "../../../types";
import { fetcher } from "../../../services/config";
import Loader from "../../shared/loader";
import SafeAreaWrapper from "../../shared/safe-area-wrapper";
import { Box, Text } from "../../../utils/theme";
import { Calendar } from "react-native-calendars";
import TaskUnScreen from "../task-group-complated/task-unscreen";
import Icon from "react-native-vector-icons/Entypo"; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import Task from "../task";

const TaskCalendarComplatedScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    mutate: mutateTasks,
  } = useSWR<ITask[]>(`tasks/tasks-completed`, fetcher, {
    refreshInterval: 5000,
  });

  if (isLoadingTasks || !tasks) {
    return <Loader />;
  }

  const markedDates = tasks.reduce((acc, task) => {
    const date = format(parseISO(task.date), "yyyy-MM-dd");
    acc[date] = {
      marked: true,
      dotColor: '#86198f',
      // Custom style for the selected date
      ...(date === selectedDate ? { selected: true, selectedColor: '#d946ef' } : {})
    };
    return acc;
  }, {} as { [key: string]: { marked: boolean, dotColor: string, selected?: boolean, selectedColor?: string } });


  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setCalendarVisible(false); // Close calendar on date selection
  };

  // Calculate the first and last day of the current month
  const startDate = startOfMonth(new Date());
  const endDate = endOfMonth(new Date());

  // Filter tasks based on the selected date and search query
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const taskDate = parseISO(task.date);
      const taskDateFormatted = format(taskDate, "yyyy-MM-dd");
      return (
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedDate
          ? taskDateFormatted === selectedDate
          : taskDate >= startDate && taskDate <= endDate)
      );
    });
  }, [tasks, searchQuery, selectedDate]);

  const sortedTasks = filteredTasks
  .slice()
  .sort((a, b) => {
    const dueDateA = new Date(a.date);
    const dueDateB = new Date(b.date);

    // Đưa các task chưa hoàn thành lên đầu
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }

    // Sắp xếp các task chưa hoàn thành theo ngày đến hạn gần nhất
    // và các task đã hoàn thành theo ngày đến hạn xa nhất
    return a.isCompleted
      ? dueDateB.getTime() - dueDateA.getTime() // Task đã hoàn thành: ngày đến hạn xa nhất
      : dueDateA.getTime() - dueDateB.getTime(); // Task chưa hoàn thành: ngày đến hạn gần nhất
  });

 

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box height={16} />
        <Text variant="textXl" fontWeight="700" ml="3">
          Đã hoàn thành
        </Text>
        <Box height={16} />

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
          <Pressable onPress={() => setCalendarVisible(!calendarVisible)} style={styles.iconButton}>
            <Icon name={calendarVisible ? "chevron-up" : "chevron-down"} size={24} color="#f472b6" />
          </Pressable>
        </View>

        {calendarVisible && (
          <Box mb="4">
              <View style={styles.calendarContainer}>
            <Calendar
              current={format(new Date(), "yyyy-MM-dd")}
              onDayPress={handleDayPress}
              markedDates={markedDates}
              theme={{
                calendarBackground: 'white',
                textSectionTitleColor: 'blue',
                selectedDayBackgroundColor: 'blue',
                selectedDayTextColor: 'white',
                todayTextColor: 'blue',
                dayTextColor: 'black',
                dotColor: 'blue',
                selectedDotColor: 'white',
                arrowColor: 'blue',
              }}
            />
            </View>
          </Box>
        )}

        <Text variant="textLg" fontWeight="500" ml="3" mb="4">
          Công việc {selectedDate ? `của ${format(parseISO(selectedDate), "dd MMMM yyyy")}` : "của tháng này"}
        </Text>

        <FlatList
          data={sortedTasks}
          renderItem={({ item }) => <Task task={item} mutateTasks={mutateTasks} />}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <Box />}
        />
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
  iconButton: {
    padding: 10,
  },
  calendarContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white', // Thêm màu nền cố định
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderColor: '#f0abfc',
    borderWidth: 1,
  },
});

export default TaskCalendarComplatedScreen;
