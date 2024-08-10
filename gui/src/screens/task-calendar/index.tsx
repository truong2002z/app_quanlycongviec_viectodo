import React, { useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import useSWR from "swr";
import { format, parseISO } from "date-fns";
import { fetcher } from "../../services/config";
import Loader from "../../components/shared/loader";
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper";
import { Box, Text } from "../../utils/theme";
import Task from "../../components/tasks/task";
import { Calendar } from "react-native-calendars";
import { ITask } from "../../types";

const TaskCalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    mutate: mutateTasks,
  } = useSWR<ITask[]>(`tasks/`, fetcher, {
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
  };

  // Sắp xếp các task
  const sortedTasks = tasks
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
          Events
        </Text>
        <Box height={16} />

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

        <Text variant="textLg" fontWeight="500" ml="3" mb="4">
          Tasks for {format(parseISO(selectedDate), "MMMM dd, yyyy")}
        </Text>

        <FlatList
          data={sortedTasks.filter(task => format(parseISO(task.date), "yyyy-MM-dd") === selectedDate)}
          renderItem={({ item }) => <Task task={item} mutateTasks={mutateTasks} />}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <Box height={1} />}
        />
      </Box>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
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

export default TaskCalendarScreen;
