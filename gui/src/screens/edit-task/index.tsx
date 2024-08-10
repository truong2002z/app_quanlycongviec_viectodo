import React, { useEffect, useState } from "react";
import { Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { useTheme } from "@shopify/restyle";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { Calendar } from "react-native-calendars";
import { HomeStackParamList } from "../../navigation/types";
import { ICategory, ITask } from "../../types";
import axiosInstance, { fetcher } from "../../services/config";
import { Box, Text, Theme } from "../../utils/theme";
import Loader from "../../components/shared/loader";
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import Input from "../../components/shared/input";
import { Dropdown } from "react-native-element-dropdown";
import NavigateBack from "../../components/shared/navigate-back";
import { today } from "../../components/tasks/task-actions-pro";
import { isToday, format, isAfter, endOfDay } from "date-fns";

type EditTaskRouteType = RouteProp<HomeStackParamList, "EditTask">;

const updateTaskRequest = async (url: string, { arg }: { arg: ITask }) => {
  try {
    await axiosInstance.put(url + "/" + arg._id, {
      ...arg,
    });
  } catch (error) {}
};

const deleteTaskRequest = async (
  url: string,
  { arg }: { arg: { id: string } }
) => {
  try {
    await axiosInstance.delete(url + "/" + arg.id);
  } catch (error) {}
};

const EditTaskScreen = () => {
  const theme = useTheme<Theme>();
  const route = useRoute<EditTaskRouteType>();
  const navigation = useNavigation();
  const { trigger } = useSWRMutation("tasks/editTask", updateTaskRequest);
  const { trigger: triggerDelete } = useSWRMutation("tasks/delete", deleteTaskRequest);
  const { task } = route.params;
  const [updatedTask, setUpdatedTask] = useState(task);
  const { mutate } = useSWRConfig();
  const [isSelectingCategory, setIsSelectingCategory] = useState<boolean>(false);
  const [isSelectingDate, setIsSelectingDate] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState(150);
  
  const { data: categories, isLoading } = useSWR<ICategory[]>(
    "categories",
    fetcher
  );
  const dropdownItems = categories?.map((category) => ({
    label: category.name,
    value: category._id,
  }));

  const deleteTask = () => {
    Alert.alert(
      "Xóa công việc",
      "Bạn có chắc chắn muốn xóa công việc này không?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              await triggerDelete({
                id: task._id,
              });
              await mutate("tasks/");
              navigation.goBack();
            } catch (error) {
              console.log("error in deleteTask", error);
              throw error;
            }
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  const updateTask = async () => {
    // Hiển thị thông báo xác nhận trước khi cập nhật
    Alert.alert(
      "Xác nhận cập nhật",
      "Bạn có muốn cập nhật công việc này không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Cập nhật",
          onPress: async () => {
            try {
              // Kiểm tra xem tên công việc có hợp lệ không
              if (updatedTask.name.trim().length > 0) {
                // Thực hiện cập nhật công việc
                await trigger({ ...updatedTask });
  
                // Cập nhật lại dữ liệu
                await mutate("tasks/");
  
                // Điều hướng trở lại màn hình trước đó
                navigation.goBack();
  
                // Hiển thị thông báo thành công
                Alert.alert("Cập nhật thành công", "Công việc đã được cập nhật.");
              } else {
                // Hiển thị thông báo lỗi nếu tên công việc không hợp lệ
                Alert.alert("Cập nhật không thành công", "Tên công việc không được để trống.");
              }
            } catch (error) {
              console.log("Error in updateTask", error);
              // Hiển thị thông báo lỗi nếu có lỗi xảy ra
              Alert.alert("Lỗi", "Đã xảy ra lỗi khi cập nhật công việc. Vui lòng thử lại.");
            }
          },
        },
      ]
    );
  };
  
  if (isLoading || !categories) {
    return <Loader />;
  }

  const selectedCategory = categories?.find(
    (_category) => _category._id === updatedTask.categoryId
  );

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const deadline = new Date(task.date);
      
      // Set deadline to end of the day
      const endOfDeadline = endOfDay(deadline);
      
      if (isAfter(now, endOfDeadline)) {
        setTimeLeft("Đã hết hạn");
        return;
      }

      const difference = endOfDeadline.getTime() - now.getTime();
      const days = Math.floor(difference / (24 * 60 * 60 * 1000));
      const hours = Math.floor((difference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutes = Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000));
      const seconds = Math.floor((difference % (60 * 1000)) / 1000);

      setTimeLeft(
        `${days} ngày ${hours} giờ ${minutes} phút`
      );
    };

    calculateTimeLeft(); // Initial calculation

    const interval = setInterval(calculateTimeLeft, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [task.date]);



  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <NavigateBack />
          {!task.isCompleted && (
            <>
              <Pressable onPress={updateTask} style={{ right: -100 }}>
                <Icon
                  name="check"
                  size={26}
                  color='green'
                />
              </Pressable>
            </>
          )}
          <Pressable onPress={deleteTask} style={{ right: 10 }}>
            <Icon
              name="delete"
              size={26}
              color={theme.colors.rose500}
            />
          </Pressable>
        </Box>
        <Box height={20} />
        <Input
          label="Tên công việc"
          placeholder={task.name}
          style={[styles.textInput, { fontSize: 16, backgroundColor: task.isCompleted ? '#f0f0f0' : '#ffffff' }]}
          maxLength={40}
          textAlignVertical="center"
          value={updatedTask.name}
          onChangeText={(text) => {
            if (!task.isCompleted) {
              setUpdatedTask((prev) => ({
                ...prev,
                name: text,
              }));
            }
          }}
          editable={!task.isCompleted}
        />
        <Box mt="4">
          <ScrollView>
            <Input
              label="Mô tả"
              placeholder="Thêm mô tả"
              multiline
              numberOfLines={13}
              value={updatedTask.description}
              style={[styles.textInput, styles.text, { height: 200, textAlignVertical: 'top', backgroundColor: task.isCompleted ? '#f0f0f0' : '#ffffff' }]}
              onChangeText={(text) => {
                if (!task.isCompleted) {
                  setUpdatedTask((prev) => ({
                    ...prev,
                    description: text,
                  }));
                }
              }}
              editable={!task.isCompleted}
            />
          </ScrollView>
          <Box height={20} />
        </Box>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            {task.isCompleted ? "Nhiệm vụ đã hoàn thành" : "Nhiệm vụ chưa hoàn thành"}
          </Text>
          <Text style={styles.timeLeftText}>{timeLeft}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', bottom: -8, }}>
          <Text variant="textSm">Ngày</Text>
          <Text variant="textSm" style={{ right: 120 }}>Danh mục</Text>
        </View>
        <View style={styles.dateCategoryContainer}>
          <Pressable onPress={() => setIsSelectingDate((prev) => !prev)} style={styles.datePickerButton}>
            <Text>
              {isToday(new Date(updatedTask.date))
                ? "Hôm nay"
                : format(new Date(updatedTask.date), "dd/MM/yyyy")}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              if (!task.isCompleted) {
                setIsSelectingCategory((prev) => !prev);
              }
            }}
          >
            <Box style={styles.categoryBox}>
              <Text
                style={{
                  color: selectedCategory?.color.code, fontSize: 16
                }}
              >
                {truncateText(selectedCategory?.name || "Categories", 15)}
              </Text>
              <Icon name="chevron-down" size={24} />
            </Box>
          </Pressable>
        </View>
        {isSelectingCategory && (
          <Box alignItems="flex-end" justifyContent="flex-start" top={-10}>
            <FlatList
              data={categories}
              renderItem={({ item, index }) => {
                return (
                  <Pressable
                    onPress={() => {
                      if (!task.isCompleted) {
                        setUpdatedTask((prev) => ({
                          ...prev,
                          categoryId: item._id,
                        }));
                        setIsSelectingCategory(false);
                      }
                    }}
                  >
                    <Box
                      bg="white"
                      p="2"
                      width={180}
                      borderTopStartRadius={index === 0 ? "rounded-3xl" : "none"}
                      borderTopEndRadius={index === 0 ? "rounded-3xl" : "none"}
                    >
                      <Box flexDirection="row">
                        <Text color="neutral900">{item.icon.symbol}</Text>
                        <Text
                          ml="2"
                          fontWeight={updatedTask.categoryId === item._id ? "700" : "400"}
                          color="neutral900"
                        >
                          {truncateText(item.name, 20)}
                        </Text>
                      </Box>
                    </Box>
                  </Pressable>
                );
              }}
              keyExtractor={(item) => item._id}
              style={{ maxHeight: 100 }}
              scrollEnabled={true}
            />
          </Box>
        )}

        {isSelectingDate && (
          <Modal transparent={true} animationType="slide">
            <TouchableWithoutFeedback onPress={() => setIsSelectingDate(false)}>
              <View style={styles.overlay}>
                <Box style={styles.modalContent}>
                  <Calendar
                    style={{
                      borderRadius: 10,
                      height: 350,
                      width: 320,
                    }}
                    theme={{
                      selectedDayBackgroundColor: '#DB3AFF',
                      todayTextColor: '#DB3AFF',
                      dayTextColor: 'black',
                      dotColor: '#DB3AFF',
                      selectedDotColor: 'white',
                      arrowColor: '#DB3AFF',
                    }}
                    onDayPress={(day: { dateString: string | number | Date }) => {
                      if (!task.isCompleted) {
                        setIsSelectingDate(false);
                        const selectedDate = new Date(day.dateString).toISOString();
                        setUpdatedTask((prev) => ({
                          ...prev,
                          date: selectedDate,
                        }));
                      }
                    }}
                  />
                </Box>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </Box>
    </SafeAreaWrapper>
  );
};

export default EditTaskScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    backgroundColor: "white",
    height: 60,
    borderRadius: 5,
    borderColor: "#DB3AFF",
    borderWidth: 1,
    flexDirection: "row",
    position: "relative",
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    padding: 20,
    borderColor: "#d946e9",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 0,
    backgroundColor: 'white',
    height: 60
  },
  text: {
    fontSize: 16,
    padding: 10,
    textAlign: 'justify'
  },
  dateCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    textAlign: 'center'
  },
  datePickerButton: {
    padding: 10,
    borderColor: "#d946e9",
    borderWidth: 1,
    borderRadius: 5,
    width: 180,
    height: 45,
    backgroundColor: 'white',
    fontSize: 16
  },
  datePickerText: {
    color: 'black',
    fontSize: 16
  },
  categoryBox: {
    height: 45,
    width: 180,
    borderColor: "#d946e9",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statusContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  timeLeftText: {
    fontSize: 12,
    color: "#f472b6",
    marginTop: 4,
  },
});
