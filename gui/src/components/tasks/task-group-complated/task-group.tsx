import React, { useState } from "react";
import { Pressable, FlatList, View, StyleSheet } from "react-native";
import { Text } from "../../../utils/theme";
import Icon from "react-native-vector-icons/Entypo";
import { ITask } from "../../../types";
import Task from "../task";
import TaskUnScreen from "./task-unscreen";

type TaskGroupProps = {
  title: string;
  tasks: ITask[];
  mutateTasks: () => Promise<ITask[] | undefined>;
};

const TaskGroup: React.FC<TaskGroupProps> = ({ title, tasks, mutateTasks }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleExpand} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Icon name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#007bff" />
      </Pressable>
      {expanded && (
        <FlatList
          data={tasks}
          renderItem={({ item }) => <TaskUnScreen task={item} mutateTasks={mutateTasks} />}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    // Remove background color, border, shadow
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Remove background color, border
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  separator: {
    height: 8,
    backgroundColor: '#f9f9f9',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default TaskGroup;


