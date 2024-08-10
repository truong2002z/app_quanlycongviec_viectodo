import { format, isToday } from "date-fns"
import React, { useState } from "react"
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native"
import { Calendar } from "react-native-calendars"
import useSWR, { useSWRConfig } from "swr"
import useSWRMutation from "swr/mutation"
import Loader from "../shared/loader"
import { ICategory, ITaskRequest } from "../../types"
import axiosInstance, { fetcher } from "../../services/config"
import { Box, Text } from "../../utils/theme"

type TaskActionsProps = {
  categoryId: string
}

export const today = new Date()

export const todaysISODate = new Date()
todaysISODate.setHours(0, 0, 0, 0)

const createTaskRequest = async (
  url: string,
  { arg }: { arg: ITaskRequest }
) => {
  try {
    await axiosInstance.post(url, {
      ...arg,
    })
  } catch (error) {
    console.log("error in createTaskRequest", error)
    throw error
  }
}

const TaskActions = ({ categoryId }: TaskActionsProps) => {
  const [newTask, setNewTask] = useState<ITaskRequest>({
    categoryId: categoryId,
    date: todaysISODate.toISOString(),
    isCompleted: false,
    name: "",
    description: "",

  })

  const { data, trigger } = useSWRMutation("tasks/create", createTaskRequest)

  const [isSelectingCategory, setIsSelectingCategory] = useState<boolean>(false)
  const [isSelectingDate, setIsSelectingDate] = useState<boolean>(false)

  const { data: categories, isLoading } = useSWR<ICategory[]>(
    "categories",
    fetcher
  )

  const { mutate } = useSWRConfig()

  if (isLoading || !categories) {
    return <Loader />
  }

  const selectedCategory = categories?.find(
    (_category) => _category._id === newTask.categoryId
  )

  const onCreateTask = async () => {
    try {
      if (newTask.name.length.toString().trim().length > 0) {
        await trigger({
          ...newTask,
        })
        setNewTask({
          categoryId: newTask.categoryId,
          isCompleted: false,
          date: todaysISODate.toISOString(),
          name: "",
          description: "",
         
        })
        await mutate("tasks/")
      }
    } catch (error) {
      console.log("error in onCreateTask", error)
      throw error
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Box>
      <Box
        bg="white"
        px="4"
        py="3.5"
        borderRadius="rounded-5xl"
        flexDirection="row"
        position="relative"
        style={{borderWidth:1, borderColor: "#f0abfc"}}
        justifyContent="space-between"
      >
        <TextInput
          placeholder="Create a new task"
          style={{
            paddingVertical: 8,
            paddingHorizontal: 8,
            fontSize: 16,
            width: "50%",
          }}
          maxLength={36}
          textAlignVertical="center"
          value={newTask.name}
          onChangeText={(text) => {
            setNewTask((prev) => {
              return {
                ...prev,
                name: text,
              }
            })
          }}
          onSubmitEditing={onCreateTask}
        />
        <Box flexDirection="row" alignItems="center">
          <Pressable
            onPress={() => {
              setIsSelectingDate((prev) => !prev)
            }}
          >
            <Box
              flexDirection="row"
              alignContent="center"
              bg="white"
              p="2"
              borderRadius="rounded-xl"
              style={{borderWidth:1, borderColor: "#38bdf8"}}
            >
              <Text>
                {isToday(new Date(newTask.date))
                  ? "Today"
                  : format(new Date(newTask.date), "MMM-dd")}
              </Text>
            </Box>
          </Pressable>
          <Box width={12} />
          <Pressable
            onPress={() => {
              setIsSelectingCategory((prev) => !prev)
            }}
          >
            <Box
              bg="white"
              flexDirection="row"
              alignItems="center"
              p="2"
              borderRadius="rounded-xl"
              style={{borderWidth:1, borderColor: "#38bdf8"}}
            >
              <Box
                width={12}
                height={12}
                borderRadius="rounded"
                borderWidth={2}
                mr="1"
                style={{
                  borderColor: selectedCategory?.color.code,
                }}
              ></Box>
              <Text
                style={{
                  color: selectedCategory?.color.code,
                }}
              >
               {truncateText(selectedCategory?.name || "Categories", 6)}
              </Text>
            </Box>
          </Pressable>
        </Box>
      </Box>
      {isSelectingCategory && (
        <Box alignItems="flex-end" my="4" justifyContent="flex-end">
          <FlatList
            data={categories}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  onPress={() => {
                    setNewTask((prev) => {
                      return {
                        ...prev,
                        categoryId: item._id,
                      }
                    })
                    setIsSelectingCategory(false)
                  }}
                >
                  <Box
                    style={{maxWidth: "auto", width: 200}}
                    bg="white"
                    p="2"
                    borderTopStartRadius={index === 0 ? "rounded-3xl" : "none"}
                    borderTopEndRadius={index === 0 ? "rounded-3xl" : "none"}
                    borderBottomStartRadius={
                      categories?.length - 1 === index ? "rounded-2xl" : "none"
                    }
                    borderBottomEndRadius={
                      categories?.length - 1 === index ? "rounded-2xl" : "none"
                    }
                  >
                    <Box flexDirection="row">
                      <Text>{item.icon.symbol}</Text>
                      <Text
                        ml="2"
                        fontWeight={
                          newTask.categoryId === item._id ? "700" : "400"
                        }
                      >
                       {truncateText(item.name, 20)}
                      </Text>
                    </Box>
                  </Box>
                </Pressable>
              )
            }}
          />
        </Box>
      )}
      {isSelectingDate && (
        <Box style={{paddingTop:20}}>
          <View style={styles.calendarContainer}>
            <Calendar
              minDate={format(today, "y-MM-dd")}
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
              onDayPress={(day: { dateString: string | number | Date }) => {
                setIsSelectingDate(false)
                const selectedDate = new Date(day.dateString).toISOString()
                setNewTask((prev) => {
                  return {
                    ...prev,
                    date: selectedDate,
                  }
                })
              }}
            />
          </View>
        </Box>
      )}
    </Box>
  )
}

export default TaskActions

const styles = StyleSheet.create({
  calendarContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
})
