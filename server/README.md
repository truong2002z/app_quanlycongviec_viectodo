


config ts

npm i -D typescript ts-node @types/express @types/node

npx tsc --init


cấu hình mục dev ở package.json như này để mỗi lần run cho nó gọn 
{"dev": "ts-node ./src/server.ts && node ./dist/server.js"}



step by step 

1. Cấu hình nodejs express (npm init, npm install express)
2. tạo file db.ts gán link mongoDB (file này cấu hình connect to mongoDB) {npm install express}
3. tạo cái models (tạo mấy cái model có trong cái csdl đã phân tích) ví dụ (user-model.ts)
4. tao cái controllers cho từng cái models (ví dụ user.controller.ts)
5. cài jsonwebtoken và khứa bcrypt.js để nó bảo mật hơn tý (npm install jsonwebtoken bcrypt npm i --save-dev @types/bcrypt)
6. tạo router
7. tạo types khai báo kiểu dữ liệu