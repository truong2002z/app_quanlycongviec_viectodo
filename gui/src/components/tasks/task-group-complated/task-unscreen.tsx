import React from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import useSWRMutation from "swr/mutation";
import { ITask } from "../../../types";
import axiosInstance from "../../../services/config";
import { HomeScreenNavigationType } from "../../../navigation/types";
import { useNavigation } from "@react-navigation/native";

type TaskProps = {
  task: ITask;
  mutateTasks: () => Promise<ITask[] | undefined>;
};

interface ITaskStatusRequest {
  id: string;
  isCompleted: boolean;
}

const toggleTaskStatusRequest = async (
  url: string,
  { arg }: { arg: ITaskStatusRequest }
) => {
  try {
    await axiosInstance.put(url + "/" + arg.id, { ...arg });
  } catch (error) {
    console.log("error in toggleTaskStatusRequest", error);
    throw error;
  }
};

const TaskUnScreen = ({ task, mutateTasks }: TaskProps) => {
  const { trigger } = useSWRMutation("tasks/update", toggleTaskStatusRequest);
  const offset = new Animated.Value(1);
  const checkmarkIconSize = new Animated.Value(0.8);
  const navigation = useNavigation<HomeScreenNavigationType>();

  const toggleTaskStatus = async () => {
    try {
      const _updatedTask = {
        id: task._id,
        isCompleted: !task.isCompleted,
      };
      await trigger(_updatedTask);
      await mutateTasks();
      Animated.spring(offset, {
        toValue: _updatedTask.isCompleted ? 1.05 : 1,
        useNativeDriver: true,
      }).start();
      Animated.spring(checkmarkIconSize, {
        toValue: _updatedTask.isCompleted ? 1 : 0,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.log("error in toggleTaskStatus", error);
      throw error;
    }
  };

  const navigateToEditTask = () => {
    navigation.navigate("EditTask", { task });
  };

  const animatedStyles = {
    transform: [{ scale: offset }],
  };

  const checkMarkIconStyles = {
    transform: [{ scale: checkmarkIconSize }],
    opacity: task.isCompleted ? 1 : 0,
  };

  return (
    <Pressable onPress={toggleTaskStatus} style={styles.pressable}>
      <View
        style={[
          styles.taskContainer,
          {
            backgroundColor: task.isCompleted ? "#d9f7d9" : "#ffffff",
          },
        ]}
      >
        <View style={styles.taskContent}>
          <Animated.View style={[styles.checkmarkContainer, {
            backgroundColor: task.isCompleted ? "#a3d9a1" : "#e0e0e0",
          }]}>
            {task.isCompleted && (
              <Animated.View style={checkMarkIconStyles}>
                <Icon name="check" size={20} color="#ffffff" />
              </Animated.View>
            )}
          </Animated.View>
          <Text style={[styles.taskText, {
            color: task.isCompleted ? "#4CAF50" : "#333333",
            textDecorationLine: task.isCompleted ? 'line-through' : 'none',
          }]}>
            {task.name}
          </Text>
        </View>
        <Pressable onPress={navigateToEditTask} style={styles.editButton}>
          <Icon name="dots-three-vertical" size={20} color="#333333" />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: '#f9f9f9',
    elevation: 2,  // Adds shadow effect for Android
    shadowColor: '#000000',  // Adds shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskContainer: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Removed borderWidth
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmarkContainer: {
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    // Removed borderWidth
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
  },
});

export default TaskUnScreen;
