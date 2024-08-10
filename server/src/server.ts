import express, { Request, Response } from 'express';
import connectToDatabase from './db';
import userRouters from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import taskRoutes from './routes/task.routes';
import schedule from 'node-schedule';
import admin from './firebaseAdmin';
import sendDueTaskNotifications from './Notifications/sendDueTaskNotifications';

const application = express();

application.use(express.json());

const PORT = 4000;

connectToDatabase();

// Lên lịch chạy vào 8:00 AM mỗi ngày
schedule.scheduleJob('0 8 * * *', () => {
  sendDueTaskNotifications();
});

// Lên lịch chạy vào 12:00 PM mỗi ngày
schedule.scheduleJob('0 12 * * *', () => {
  sendDueTaskNotifications();
});

// Lên lịch chạy vào 6:00 PM mỗi ngày
schedule.scheduleJob('0 18 * * *', () => {
  sendDueTaskNotifications();
});

// // Lên lịch chạy vào 22:40 mỗi ngày
// schedule.scheduleJob('38 22 * * *', () => {
//   sendDueTaskNotifications();
// });

// Gửi thông báo bằng cơm 
application.post('/send-notification', async (req, res) => {
  try {
    await sendDueTaskNotifications(); // Gọi hàm gửi thông báo
    res.status(200).send('Successfully sent notifications');
  } catch (error) {
    res.status(500).send(`Error sending notifications: ${error}`);
  }
});
// Gửi thông báo bằng cơm, gắn token bằng cơm 

// application.post('/send-notification', async (req, res) => {
  //   const { title, body, token } = req.body;
  //   const message = {
  //     notification: {
  //       title: 'Nhắc nhở hoàn thanh công việc',
  //       body: `Hôm nay bạn có công việc cần hoàn thành`,
  //     },
  //     token:'c61DKCCDTvKNlCmw7DVINN:APA91bFXXVw1WskInOLvuUsvnsMYLaBFYEm8InEoj46Urk4uGslnnI8sP1q8FRmGJTxkspimw4E-TkX5Y7H0UXsrSVU92btYEqJYcGiU6_tVnNZ17mOIJeKugBGeqLRqA1RCCZYjz3aa',
  //   };
  
  //   try {
  //     const response = await admin.messaging().send(message);
  //     res.status(200).send(`Successfully sent message: ${response}`);
  //   } catch (error) {
  //     res.status(500).send(`Error sending message: ${error}`);
  //   }

  //         sendDueTaskNotifications();
 
  // });

application.get('/ping',(request:Request, response: Response) => {
    response.send('pong');
})

application.use("/users", userRouters)
application.use("/categories", categoryRoutes)
application.use("/tasks", taskRoutes)


application.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})