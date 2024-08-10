import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { ITask } from "../../../types";
import TaskGroup from "./task-group";


// Helper functions to format dates
const formatDate = (date: Date) => {
  const months = [
    'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu',
    'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${day} ${month}`;
};

// Helper function to format group keys
const formatGroupKey = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Months are zero-based
  const day = date.getDate();
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

type TaskListProps = {
  tasks: ITask[];
  mutateTasks: () => Promise<ITask[] | undefined>;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, mutateTasks }) => {
  // Group tasks by year, month, and day
  const groupedTasks = tasks.reduce((groups: { [key: string]: ITask[] }, task: ITask) => {
    const date = new Date(task.date);
    const groupKey = formatGroupKey(date);

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(task);

    return groups;
  }, {});

  // Sort keys by year, month, and day in descending order
  const sortedKeys = Object.keys(groupedTasks).sort((a, b) => b.localeCompare(a));

  const renderTaskGroups = () => {
    return sortedKeys.map((key) => {
      const [year, month, day] = key.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const formattedDate = formatDate(date);
      return (
        <View key={key} style={styles.groupContainer}>
          <TaskGroup
            title={`${formattedDate}, ${year}`}
            tasks={groupedTasks[key]}
            mutateTasks={mutateTasks}
          />
        </View>
      );
    });
  };

  return <View style={styles.listContainer}>{renderTaskGroups()}</View>;
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
});

export default TaskList;
