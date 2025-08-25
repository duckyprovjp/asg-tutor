# Hệ thống Quản lý Gia sư

Hệ thống quản lý gia sư toàn diện với các chức năng cho Admin, Giáo viên và Học sinh.

## Tính năng chính

### 🔐 Xác thực (Authentication)

- Đăng ký tài khoản với vai trò (Admin/Giáo viên/Học sinh)
- Đăng nhập/Đăng xuất
- Quên mật khẩu (OTP/Email)
- Quản lý hồ sơ cá nhân

### 👨‍💼 Admin

- **CRUD Giáo viên**: Thêm, sửa, xóa, xem danh sách giáo viên
- **CRUD Lịch học**: Quản lý lịch học của tất cả người dùng
- **CRUD Người dùng**: Quản lý tài khoản người dùng
- **Thống kê**: Dashboard với số liệu tổng quan

### 👨‍🏫 Giáo viên

- **Xem lịch dạy**: Lịch học hôm nay và sắp tới
- **Điểm danh học sinh**: Check-in/out học sinh
- **Tạo hồ sơ**: Cập nhật thông tin cá nhân và chuyên môn
- **Quản lý hồ sơ**: Xem và chỉnh sửa thông tin

### 👨‍🎓 Học sinh

- **Xem lịch học**: Lịch học cá nhân
- **Đăng ký học**: Tìm và đăng ký với giáo viên
- **Đánh giá giáo viên**: Rate và review sau buổi học

### 🔔 Thông báo (Notifications)

- Thông báo thay đổi lịch học
- Tin nhắn mới
- Nhắc nhở buổi học

### 🔍 Tìm kiếm & Lọc

- Tìm giáo viên theo môn học, giá, địa điểm
- Lọc theo đánh giá
- Tìm kiếm nâng cao

### ⭐ Hệ thống Review & Ranking

- Top giáo viên
- Top học sinh tích cực
- Đánh giá và nhận xét

### 📅 Lịch (Calendar View)

- Giao diện hiển thị trực quan buổi học
- Quản lý lịch học

## Công nghệ sử dụng

- **Frontend**: React 19, Material-UI
- **Backend**: JSON Server (REST API)
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js (version 16 trở lên)
- npm hoặc yarn

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd asg
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Chạy ứng dụng

```bash
# Chạy cả frontend và backend
npm run dev

# Hoặc chạy riêng lẻ:
# Backend (JSON Server)
npm run server

# Frontend (React)
npm start
```

### Bước 4: Truy cập ứng dụng

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Tài khoản mẫu

### Admin

- Email: admin@tutoring.com
- Password: admin123

### Giáo viên

- Email: tutor1@example.com
- Password: tutor123

### Học sinh

- Email: student1@example.com
- Password: student123

## Cấu trúc dự án

```
asg/
├── public/
├── src/
│   ├── components/          # Components tái sử dụng
│   │   ├── LoadingSpinner.js
│   │   └── Navbar.js
│   ├── context/            # React Context
│   │   └── AuthContext.js
│   ├── pages/              # Các trang chính
│   │   ├── AdminDashboard.js
│   │   ├── TutorDashboard.js
│   │   ├── StudentDashboard.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Profile.js
│   │   ├── TutorList.js
│   │   ├── ScheduleManagement.js
│   │   ├── Notifications.js
│   │   └── Messages.js
│   ├── services/           # API services
│   │   └── api.js
│   ├── styles/             # CSS styles
│   ├── utils/              # Utility functions
│   ├── App.js              # Main App component
│   └── index.js            # Entry point
├── db.json                 # Database (JSON Server)
├── package.json
└── README.md
```

## API Endpoints

### Authentication

- `GET /users` - Lấy danh sách người dùng
- `POST /users` - Tạo người dùng mới
- `PUT /users/:id` - Cập nhật người dùng
- `DELETE /users/:id` - Xóa người dùng

### Tutors

- `GET /tutors` - Lấy danh sách giáo viên
- `POST /tutors` - Tạo giáo viên mới
- `PUT /tutors/:id` - Cập nhật giáo viên
- `DELETE /tutors/:id` - Xóa giáo viên

### Schedules

- `GET /schedules` - Lấy danh sách lịch học
- `POST /schedules` - Tạo lịch học mới
- `PUT /schedules/:id` - Cập nhật lịch học
- `DELETE /schedules/:id` - Xóa lịch học

### Reviews

- `GET /reviews` - Lấy danh sách đánh giá
- `POST /reviews` - Tạo đánh giá mới
- `PUT /reviews/:id` - Cập nhật đánh giá
- `DELETE /reviews/:id` - Xóa đánh giá

### Notifications

- `GET /notifications` - Lấy thông báo
- `POST /notifications` - Tạo thông báo mới
- `PUT /notifications/:id` - Cập nhật thông báo

### Messages

- `GET /messages` - Lấy tin nhắn
- `POST /messages` - Gửi tin nhắn mới
- `PUT /messages/:id` - Cập nhật tin nhắn

## Tính năng nổi bật

### 🎨 Giao diện hiện đại

- Material-UI Design System
- Responsive design
- Dark/Light theme support
- Intuitive user interface

### 🔒 Bảo mật

- Role-based access control
- Protected routes
- Form validation
- Secure authentication

### 📱 Responsive

- Mobile-friendly design
- Tablet optimization
- Desktop experience

### ⚡ Performance

- Lazy loading
- Optimized API calls
- Efficient state management

## Đóng góp

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Hỗ trợ

Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng tạo issue trong repository.

---

**Lưu ý**: Đây là phiên bản demo sử dụng JSON Server làm backend. Trong môi trường production, bạn nên sử dụng database thực tế như PostgreSQL, MySQL hoặc MongoDB.
