const cors = require('cors');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// const session = require('express-session');
// const fileupload = require('express-fileupload');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/error');

// Router files
const rtBootcamp = require('./router/bootcamps');
const rtCourse = require('./router/courses');
const rtAuth = require('./router/users');
const rtRole = require('./router/roles');
const rtQuestion = require('./router/questions');

// Load env
dotenv.config({ path: './config/config.env' });

// Create global app object
const app = express();

// Kết nối với database
var isProduction = process.env.NODE_ENV === 'production';
//Connect DB    
// if (!isProduction) { 
//     connectDB();
//     console.log("err");
//     app.use(errorHandler());
// }
if (!isProduction) {
    app.use(errorHandler);
}

if (isProduction) {
    mongoose.connect(process.env.MONGODB_URI);
    // console.log("aaaaavvvv")
}
else {
    connectDB();
}


//fix cors
app.use(cors());

// Cookie parser 
app.use(cookieParser());
// Session parser
// app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

// sử dụng logging middleware
// app.use(logger);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Cấu hình dữ liệu gửi lên dạng JSON
// app.use(express.json());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// File uploading
// app.use(fileupload());
// app.use(require('method-override')());

// set folder
app.use(express.static(path.join(__dirname, '/public')));

// gắn kết với router
app.use(process.env.LINK_API_BOOTCAMPS, rtBootcamp);
app.use(process.env.LINK_API_COURSES, rtCourse);
app.use(process.env.LINK_API_AUTH, rtAuth);
app.use(process.env.LINK_API_ROLE, rtRole)
app.use(process.env.LINK_API_QUESTION, rtQuestion)

// Chạy errorHandler (phải đặt chạy sau api)
// app.use(errorHandler);

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