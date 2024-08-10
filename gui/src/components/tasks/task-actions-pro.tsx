import { format, isToday } from "date-fns";
import React, { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Calendar } from "react-native-calendars";
import useSWR, { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import Loader from "../shared/loader";
import { ICategory, ITaskRequest } from "../../types";
import axiosInstance, { fetcher } from "../../services/config";
import { Box, Text } from "../../utils/theme";
import Button from "../shared/button";
import { Dropdown } from "react-native-element-dropdown";

type TaskActionsProps = {
  categoryId: string;
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const today = new Date();

export const todaysISODate = new Date();
todaysISODate.setHours(0, 0, 0, 0);

const createTaskRequest = async (
  url: string,
  { arg }: { arg: ITaskRequest }
) => {
  try {
    await axiosInstance.post(url, {
      ...arg,
    });
  } catch (error) {
    console.log("error in createTaskRequest", error);
    throw error;
  }
};

const TaskActions = ({ categoryId, isModalVisible, setModalVisible }: TaskActionsProps) => {
  const [isSelectingDate, setIsSelectingDate] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<ITaskRequest>({
    categoryId: categoryId,
    date: todaysISODate.toISOString(),
    isCompleted: false,
    name: "",
    description: '',
  });

  const { data, trigger } = useSWRMutation("tasks/create", createTaskRequest);

  const { data: categories, isLoading } = useSWR<ICategory[]>(
    "categories",
    fetcher
  );

  const { mutate } = useSWRConfig();

  if (isLoading || !categories) {
    return <Loader />;
  }

  const dropdownItems = categories.map((category) => ({
    label: category.name,
    value: category._id,
  }));

  const onCreateTask = async () => {
    try {
        if (!newTask.categoryId) {
            Alert.alert('Lỗi', 'Vui lòng chọn danh mục trước khi thêm công việc.');
            return;
        }

        if (newTask.name.trim().length > 0) {
            await trigger({
                ...newTask,
            });
            setNewTask({
                categoryId: newTask.categoryId,
                isCompleted: false,
                date: todaysISODate.toISOString(),
                name: "",
                description: "",
            });
            await mutate("tasks/");
            setModalVisible(false);
            
            // Hiển thị thông báo thành công
            Alert.alert('Thành công', 'Công việc đã được thêm thành công.');
            console.log('Task created');
        } else {
            Alert.alert('Lỗi', 'Tên công việc không được bỏ trống.');
        }
    } catch (error) {
        console.log("error in onCreateTask", error);
        Alert.alert('Lỗi', 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
};

  return (
    <>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={styles.bottomModal}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Thêm công việc cần làm</Text>
            <TextInput
              placeholder='Tên công việc'
              value={newTask.name}
              onChangeText={(text) => {
                setNewTask((prev) => ({
                  ...prev,
                  name: text,
                }));
              }}
              style={styles.textInput}
            />
            <Box mb="4" />
            <TextInput
              placeholder='Mô tả'
              value={newTask.description}
              onChangeText={(text) => {
                setNewTask((prev) => ({
                  ...prev,
                  description: text,
                }));
              }}
              style={[styles.textInput, { height: 150, textAlignVertical: 'top' }]}
              multiline={true}
              numberOfLines={4}
            />
            <View style={styles.dateCategoryContainer}>
              <Pressable onPress={() => setIsSelectingDate(true)} style={styles.datePickerButton}>
                <Text style={styles.datePickerText}>
                  {isToday(new Date(newTask.date))
                    ? "Hôm nay"
                    : format(new Date(newTask.date), "MMM-dd")}
                </Text>
              </Pressable>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={dropdownItems}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder='Danh mục'
                value={newTask.categoryId}
                onChange={item => {
                  setNewTask(prev => ({ ...prev, categoryId: item.value }));
                }}
              />
            </View>
            <Box style={{width:335}}>
              <Button label='Thêm' onPress={onCreateTask}/>
            </Box>
          </Pressable>
        </Pressable>
      </Modal>

      {isSelectingDate && (
        <Modal
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsSelectingDate(false)}
        >
          <Pressable
            style={styles.overlay}
            onPress={() => setIsSelectingDate(false)}
          >
            <Pressable
              style={styles.bottomModal}
              onPress={(e) => e.stopPropagation()}
            >
              <Calendar
                minDate={format(today, "y-MM-dd")}
                onDayPress={(day: { dateString: string }) => {
                  setIsSelectingDate(false);
                  const selectedDate = new Date(day.dateString).toISOString();
                  setNewTask((prev) => ({
                    ...prev,
                    date: selectedDate,
                  }));
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomModal: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    padding: 10,
    borderColor: "#d946e9",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    width: '100%',
  },
  dateCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    width: '100%',
  },
  datePickerButton: {
    padding: 10,
    borderColor: "#d946e9",
    borderWidth: 1,
    borderRadius: 5,
    width: '49%',
    height: 45,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  datePickerText: {
    color: '#a1a1a1',
    fontSize: 14,
  },
  dropdown: {
    height: 45,
    width: '48%',
    borderColor: "#d946e9",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
  },
  placeholderStyle: {
    color: '#A1A1A1',
    fontSize: 14,
  },
  selectedTextStyle: {
    color: '#000',
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    color: '#d946e9',
    fontSize: 16,
  },
});

export default TaskActions;