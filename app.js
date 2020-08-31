const cors = require('cors');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
// const fileupload = require('express-fileupload');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/error');
// Router files
const rtBootcamp = require('./router/bootcamps');
const rtCourse = require('./router/courses');
const rtAuth = require('./router/auth');
const rtRole = require('./router/roles');
const rtQuestion = require('./router/questions');
// const logger = require('./middleware/logger')

// Load env
dotenv.config({ path: './config/config.env' });

// Kết nối với database
connectDB();

const app = express();

//fix cors
app.use(cors());

// Cấu hình dữ liệu gửi lên dạng JSON
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// sử dụng logging middleware
// app.use(logger);
if (process.env.NODE_ENV === 'development') { 
    app.use(morgan('dev'));
}

// File uploading
// app.use(fileupload());

// set folder
app.use(express.static(path.join(__dirname, 'public')));

// gắn kết với router
app.use(process.env.LINK_API_BOOTCAMPS, rtBootcamp);
app.use(process.env.LINK_API_COURSES, rtCourse);
app.use(process.env.LINK_API_AUTH, rtAuth);
app.use(process.env.LINK_API_ROLE, rtRole)
app.use(process.env.LINK_API_QUESTION, rtQuestion)

// Chạy errorHandler (phải đặt chạy sau api)
app.use(errorHandler);
 
// Khởi tạo server
const server = app.listen(
    process.env.PORT,
    console.log(`Server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`)
);

// Xử lí nếu không đúng mật khẩu hoặc tên đăng nhập vào DB
process.on('unhandledRejection', (err, promise) => {
    console.log(`ERROR: ${err.message}`);
    // Nếu lỗi thì đóng server và thoái process
    server.close(() => process.exit(1));
})  