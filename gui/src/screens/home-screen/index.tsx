import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, Pressable, StyleSheet, TextInput, View } from "react-native";
import { ZoomInEasyDown } from "react-native-reanimated";
import useSWR from "swr";
import { getGreeting } from "../../utils/helpers";
import useUserGlobalStore from "../../store/useUserGlobalStore";
import { ITask } from "../../types";
import { fetcher } from "../../services/config";
import Loader from "../../components/shared/loader";
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper";
import { AnimatedText, Box, Text } from "../../utils/theme";
import Task from "../../components/tasks/task";
import { format } from "date-fns-tz";
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute } from '@react-navigation/native';

const today = new Date();
const greeting = getGreeting({ hour: new Date().getHours() });

import { NavigationProp } from "@react-navigation/native";
import { colors } from "../../utils/theme/colors";
import TaskActions from "../../components/tasks/task-actions-pro";

const HomeScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
  const route = useRoute();
  const initialFilter = (route.params as { filter?: string })?.filter || 'Hôm nay';
  const { user } = useUserGlobalStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(initialFilter);


  const {
    data: tasks,
    isLoading,
    mutate: mutateTasks,
  } = useSWR<ITask[]>("tasks/", fetcher, {
    refreshInterval: 1000,
  });

  useEffect(() => {
    if (tasks) {
      const todayDate = new Date();
      const yesterdayDate = new Date(todayDate);
      yesterdayDate.setDate(todayDate.getDate() - 1);
  
      // Tính toán trạng thái quá hạn cho mỗi công việc
      const updatedTasks = tasks.map(task => {
        const dueDate = new Date(task.date);
        return {
          ...task,
          isOverdue: dueDate < yesterdayDate && !task.isCompleted
        };
      });
  
      // Lọc theo từ khóa tìm kiếm
      let filtered = updatedTasks.filter(task => task.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
      // Áp dụng bộ lọc theo ngày
      switch (currentFilter) {
        case 'Hôm nay':
          filtered = filtered.filter(task => format(new Date(task.date), "yyyy-MM-dd") === format(todayDate, "yyyy-MM-dd"));
          break;
        case 'Ngày mai':
          const tomorrow = new Date(todayDate);
          tomorrow.setDate(todayDate.getDate() + 1);
          filtered = filtered.filter(task => format(new Date(task.date), "yyyy-MM-dd") === format(tomorrow, "yyyy-MM-dd"));
          break;
        case 'Quá hạn':
          // Chỉ bao gồm các công việc quá hạn
          filtered = filtered.filter(task => task.isOverdue);
          break;
        case 'Tất cả':
          // Loại bỏ các công việc quá hạn
          filtered = filtered.filter(task => !task.isOverdue);
          break;
      }
  
      setFilteredTasks(filtered);
    }
  }, [tasks, searchQuery, currentFilter]);
  

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

 const handleFilterPress = (filter: string) => {
    setCurrentFilter(filter);
  };

 // Get the start and end of today
const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

// Đếm số lượng công việc chưa hoàn thành và đến hạn trong hôm nay
const pendingTasksCount = tasks?.filter(task => {
  const dueDate = new Date(task.date);
  return !task.isCompleted &&
    dueDate >= startOfDay &&
    dueDate <= endOfDay;
}).length ?? 0;


  const defaultAvatar = "https://picsum.photos/200";

  if (isLoading || !tasks) {
    return <Loader />;
  }

  // Sắp xếp các task
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
    })
    .slice(0, 15);

  return (
    <SafeAreaWrapper>
      
      <Box flex={1} mx="4" mt="4">
        
        {/* Header */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" mb="4">
          <View style={styles.header}>
            <Pressable onPress={() => navigation.navigate('Profile')}>
              <Image
                source={{ uri: user?.avatar || defaultAvatar }}
                style={styles.avatar}
              />
            </Pressable>
            <View style={styles.headerTextContainer}>
              <AnimatedText
                variant="textXl"
                fontWeight="600"
                entering={ZoomInEasyDown.delay(500).duration(700)}
                style={{ color: colors.gray900 }}
              >
                Xin chào {greeting},
                <Text style={{ color: colors.fuchsia500 }}> {user?.name}</Text>
              </AnimatedText>
              <Text style={{ color: colors.gray600 }}>
                {format(today, "eeee, LLL dd y")}
              </Text>
            </View>
          </View>
        </Box>

        {/* Task Count */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" mb="4">
          <Text style={{ fontSize: 17, fontWeight: 'bold', color: colors.blu400 }}>
            {pendingTasksCount > 0 ? `Có ${pendingTasksCount} việc cần làm 🎉` : 
            "Cố gắng mỗi ngày nha 🎉"}
          </Text>
        </Box>
        <Box width="100%" paddingVertical="1">
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#f472b6" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
          </View>
        </Box>

        <View
          style={{
            marginHorizontal: 2,
            marginVertical: 5,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Pressable
            style={{
              backgroundColor: currentFilter === 'Tất cả' ? "#d946e9" : "#e884f5",
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => handleFilterPress('Tất cả')}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Tất cả</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: currentFilter === 'Hôm nay' ? "#d946e9" : "#e884f5",
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => handleFilterPress('Hôm nay')}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Hôm nay</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: currentFilter === 'Ngày mai' ? "#d946e9" : "#e884f5",
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => handleFilterPress('Ngày mai')}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Ngày mai</Text>
          </Pressable>
          <Pressable
            style={{
              backgroundColor: currentFilter === 'Quá hạn' ? "#d946e9" : "#e884f5",
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => handleFilterPress('Quá hạn')}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Quá hạn</Text>
          </Pressable>
        </View>
        
        <Box height={5} />
        {tasks.length > 0 ? (
         <FlatList
         data={sortedTasks}
         renderItem={({ item }) => <Task task={item} mutateTasks={mutateTasks} />}
         ItemSeparatorComponent={() => <Box height={0} />}
         showsVerticalScrollIndicator={false}
         keyExtractor={(item) => item._id}
       />
       
        ) : (
          <View style={styles.emptyTaskContainer}>
            <Image
              style={styles.emptyTaskImage}
              source={{ uri: "https://cdn-icons-png.flaticon.com/128/6104/6104865.png" }}
            />
            <Text style={styles.emptyTaskText}>Danh sách công việc đang trống</Text>
            <Text style={styles.emptyTaskSubText}>Nhấp + để thêm công việc mới</Text>
          </View>
        )}

        <TaskActions
          categoryId=""
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
        />
      </Box>

      {/* <Pressable
        onPress={() => setModalVisible(!isModalVisible)}
        style={styles.overlayButton}
      >
        <LinearGradient
          colors={['#f472b6', '#ec4899']}
          style={styles.circleButton}
        >
          <Text style={styles.plusText}>+</Text>
        </LinearGradient>
      </Pressable> */}
    </SafeAreaWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: '#d946e9',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  emptyTaskContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
  emptyTaskImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  emptyTaskText: {
    fontSize: 18,
    marginTop: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyTaskSubText: {
    fontSize: 13,
    marginTop: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  // overlayButton: {
  //   position: 'absolute',
  //   bottom: 0,
  //   right: 0,
  //   margin: 10,
  //   zIndex: 0,
  // },
  circleButton: {
    width: 66,
    height: 66,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    fontSize: 45,
    color: '#fff',
    alignContent: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: colors.gray100,
    borderRadius: 8,
    padding: 8,
    elevation: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskCountContainer: {
    borderColor: colors.gray200,
    borderWidth: 1,
    padding: 8,
  },
});
