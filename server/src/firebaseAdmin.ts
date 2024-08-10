// import * as admin from 'firebase-admin';
// import * as serviceAccount from './config/serviceAccountKey.json';

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
// });

// export default admin;





import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

// Load biến môi trường từ tệp .env
dotenv.config();

// Đọc và phân tích chuỗi JSON từ biến môi trường
const serviceAccount = JSON.parse(process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY as string);

// Khởi tạo Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
