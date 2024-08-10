import admin from "../firebaseAdmin";
import User from "../models/user-model";

const sendNotificationToAllUsers = async () => {
  try {
    // Lấy tất cả người dùng bao gồm các device token
    const users = await User.find({ deviceToken: { $exists: true, $ne: null } });

    if (users.length === 0) {
      console.log('Không có người dùng nào có device token.');
      return;
    }

    // Tạo ánh xạ từ ID người dùng đến device token
    const userTokens: Record<string, string> = users.reduce((acc, user) => {
      if (user.deviceToken) {
        acc[user._id.toString()] = user.deviceToken;
      }
      return acc;
    }, {} as Record<string, string>);

    // Tạo một tập hợp các device token duy nhất để tránh gửi thông báo trùng lặp
    const uniqueDeviceTokens = [...new Set(Object.values(userTokens))];

    // Gửi thông báo đến tất cả các device token duy nhất
    const promises = uniqueDeviceTokens.map(async deviceToken => {
      const message = {
        notification: {
          title: 'Nhắc nhở hoàn thành công việc',
          body: 'Nhấn vào đây để xem công việc cần hoàn thành.',
        },
        token: deviceToken,
      };
      try {
        const response = await admin.messaging().send(message);
        console.log('Gửi thông báo thành công:', response);
      } catch (error) {
        console.error('Lỗi khi gửi thông báo:', error);
      }
    });

    await Promise.all(promises);
    console.log('Tất cả thông báo đã được xử lý.');
  } catch (error) {
    console.error('Lỗi trong hàm sendNotificationToAllUsers:', error);
  }
};

export default sendNotificationToAllUsers;
