
import React from "react"
import { FlatList } from "react-native"
import useSWR from "swr"
import { ITask } from "../../types"
import { fetcher } from "../../services/config"
import Loader from "../../components/shared/loader"
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper"
import { Box, Text } from "../../utils/theme"
import Task from "../../components/tasks/task"
import TaskActions from "../../components/tasks/task-actions"

const TodayScreen = () => {
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    mutate: mutateTasks,
  } = useSWR<ITask[]>(`tasks/today`, fetcher,
    {
      refreshInterval: 5000,
    }
  )

  if (isLoadingTasks || !tasks) {
    return <Loader />
  }
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
        <Box flexDirection="row">
          <Text variant="textXl" fontWeight="700" ml="3">
            Today
          </Text>
        </Box>
        <Box height={16} />
  {/* Task Actions */}
  <TaskActions categoryId="" />
        <Box height={16} />
        <FlatList
          data={sortedTasks}
          renderItem={({ item, index }) => {
            return <Task task={item} mutateTasks={mutateTasks} />
          }}
          ItemSeparatorComponent={() => <Box height={1} />}
          keyExtractor={(item) => item._id}
        />
      </Box>
      
    </SafeAreaWrapper>
  )
}

export default TodayScreen
