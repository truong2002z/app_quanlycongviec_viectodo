
import React from "react"
import { FlatList } from "react-native"
import useSWR from "swr"
import { ITask } from "../../types"
import { fetcher } from "../../services/config"
import Loader from "../../components/shared/loader"
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper"
import { Box, Text } from "../../utils/theme"
import TaskList from "../../components/tasks/task-group-complated/task-list"
import TaskCalendarComplatedScreen from "../../components/tasks/task-calendar"


const CompletedScreen = () => {
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    mutate: mutateTasks,
  } = useSWR<ITask[]>(`tasks/tasks-completed`, fetcher, {
    refreshInterval: 1000,
  })
  
  if (isLoadingTasks || !tasks) {
    return <Loader />
  }

  return (
    // <SafeAreaWrapper>
    //   <Box flex={1} mx="4">
    //     <Box height={16} />
    //     <Box flexDirection="row">
    //       <Text variant="textXl" fontWeight="700" ml="3">
    //         Công việc đã hoàn thành
    //       </Text>
    //     </Box>
    //     <Box height={16} />
    //     <FlatList
    //       data={[{ key: "taskList" }]}
    //       showsVerticalScrollIndicator={false}
    //       renderItem={() => <TaskList tasks={tasks} mutateTasks={mutateTasks} />}
    //       ItemSeparatorComponent={() => <Box height={14} />}
    //       keyExtractor={(item) => item.key}
    //     />
    //   </Box>
    
    // </SafeAreaWrapper>
      <TaskCalendarComplatedScreen/>
  );
};

export default CompletedScreen;