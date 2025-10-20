web nằm trong mục smtp-main/

HỆ THỐNG WEB — USER / ADMIN MANAGEMENT & PAYMENT FLOW
________________________________________
⚙️ 1. CẤU TRÚC THƯ MỤC DỰ ÁN
📁 back_end/
Chứa toàn bộ mã nguồn Node.js + Express + MongoDB + Email SMTP.
	back_end/
	│
	├── .env                              # Biến môi trường (DB, JWT, SMTP)
	├── index.js                          # File chính khởi động server
	├── package.json / package-lock.json  # Cấu hình thư viện npm
	├── test_mail.js                      # Script kiểm tra gửi mail SMTP
	│
	├── admin_model/                      # Controllers xử lý logic admin & user
	│   ├── authController.js             # Đăng ký, đăng nhập, refresh token, logout
	│   ├── middlewareController.js       # Xác thực JWT & quyền admin
	│   └── userController.js             # CRUD user, duyệt tài khoản, gửi mail
	│
	├── routes/                           # Định nghĩa các endpoint API
	│   ├── auth.js                       # /v1/auth (đăng nhập, đăng    ký, logout)
	│   ├── user.js                       # /v1/user (user info, admin delete)
	│   ├── order.js                      # /v1/order (quản lý đơn hàng & thanh toán)
	│
	├── user_model/                       # Mongoose models
	│   └── User.js                       # Định nghĩa schema người dùng
	│
	├── models/
	│   └── Order.js                      # Định nghĩa schema đơn hàng (thanh toán)
	│
	└── utils/
	    └── mailer.js                     # Hàm gửi mail (dùng nodemailer)
________________________________________
🌐 front_end/
Chứa giao diện người dùng (HTML + JS thuần).
	front_end/
	│
	├── admin.html              # Giao diện chính admin dashboard
	├── user_management.html     # Quản lý user, duyệt tài khoản
	├── payment_management.html  # Quản lý đơn hàng chờ xác nhận thanh toán
	├── user_dashboard.html      # Trang user: hiển thị sản phẩm, mua hàng
	├── payment.html             # Trang thanh toán (QR, xác nhận)
	├── login.html               # Đăng nhập
	├── register.html            # Đăng ký
	│
	└── js/
	    └── auth.js              # Xử lý login, register, token
________________________________________
🔄 2. WORKFLOW — LUỒNG HOẠT ĐỘNG HỆ THỐNG
sequenceDiagram
    participant User
    participant FrontEnd
    participant BackEnd
    participant MongoDB
    participant Admin
    participant MailServer

    User->>FrontEnd: Mở trang Register
    FrontEnd->>BackEnd: POST /v1/auth/register (username, email, ...)
    BackEnd->>MongoDB: Lưu user (status="pending")
    BackEnd->>MailServer: Gửi email cho Admin (có user mới chờ duyệt)
    MailServer-->>Admin: Email thông báo "Có user mới cần duyệt"

    Admin->>FrontEnd: Mở trang user_management.html
    FrontEnd->>BackEnd: GET /v1/user/list (users pending)
    Admin->>BackEnd: POST /v1/user/accept/:id
    BackEnd->>MongoDB: Cập nhật user (status="active")
    BackEnd->>MailServer: Gửi email thông báo kích hoạt cho user
    MailServer-->>User: Email "Tài khoản đã được duyệt"

    User->>FrontEnd: Login
    FrontEnd->>BackEnd: POST /v1/auth/login
    BackEnd->>MongoDB: Kiểm tra thông tin, tạo JWT token
    BackEnd-->>FrontEnd: Trả token + info user
    FrontEnd->>User: Mở user_dashboard.html

    User->>FrontEnd: Chọn sản phẩm → Thanh toán
    FrontEnd->>BackEnd: POST /v1/order/new
    BackEnd->>MongoDB: Lưu đơn hàng (status="pending_payment")
    User->>FrontEnd: Xác nhận đã thanh toán
    FrontEnd->>BackEnd: PUT /v1/order/confirm/:id
    BackEnd->>MailServer: Gửi mail báo admin có đơn chờ duyệt
    MailServer-->>Admin: Email "Có đơn hàng chờ xác nhận"

    Admin->>FrontEnd: Mở payment_management.html
    Admin->>BackEnd: PUT /v1/order/approve/:id (hoặc reject)
    BackEnd->>MongoDB: Cập nhật trạng thái
    BackEnd->>MailServer: Gửi mail OTP (nếu approve)
    MailServer-->>User: Email "Đơn hàng xác nhận, OTP: ####"
________________________________________
🔑 3. CẤU HÌNH 
Trong.env
# MongoDB connection
MONGODB_URL=mongodb+srv://username:password@cluster0.mongodb.net/?retryWrites=true&w=majority

# JWT secrets
SECRETKEY=your_jwt_secret
REFRESHTOKEN=your_refresh_token_secret

# SMTP (Gmail)
SMTP_HOST=smtp.gmail.com -> Host server của smtp là google.com
SMTP_PORT=465 -> Nếu port ảo thì là 587 (Ethereal)
SMTP_USER=Sender@gmail.com -> Tài khoản dùng để gửi mail trên server
SMTP_PASS=your_16_digit_app_password -> Password được tạo ra sau các bước hướng dẫn bên dưới
SMTP_SECURE=true -> false nếu port là 587

# Admin email
ADMIN_EMAIL=truc.vanlarrytt@hcmut.edu.vn -> email admin để gửi mail thông báo user mới
⚠️ SMTP_PASS là App Password 16 ký tự, không phải mật khẩu Gmail thật.
 
App Password được tạo theo flow sau:
🔐 Cách tạo App Password (chỉ mất 1 phút)
1.Truy cập: https://myaccount.google.com/security
2️.Bật 2-Step Verification (xác minh 2 bước)
3️.Sau khi bật, sẽ thấy mục App passwords
4️.Chọn:
•	App: Mail
•	Device: Other (Custom) → nhập NodeMailer
•	Bấm Generate
5️.Bạn sẽ thấy mã 16 ký tự, ví dụ:
ddfm vevx iqel ivva
(chính là chuỗi bạn đang có)
6️.Dán chuỗi đó vào .env như sau:
SMTP_PASS=ddfmvevxiqelivva
❗Không có khoảng trắng — loại bỏ hết cách dòng và khoảng giữa các nhóm ký tự.
________________________________________
🚀 4. HƯỚNG DẪN CHẠY HỆ THỐNG
🧩 Bước 1: Cài đặt backend
cd back_end
npm install
Các thư viện sẽ tự động cài:
•	express
•	mongoose
•	nodemailer
•	bcryptjs
•	jsonwebtoken
•	cookie-parser
•	cors
•	dotenv
•	morgan
________________________________________
🧩 Bước 2: Chạy server
node index.js
Khi thành công:
CONNECTED TO MONGODB
Server is running
Server hoạt động tại:
👉 http://localhost:8000
Ví dụ: http://localhost:8000/login.html
________________________________________
🧩 Bước 3: Chạy test mail (tùy chọn)
Test mail để kiểm tra SMTP Server đề phòng trường hợp gặp lỗi hoặc nghẽn server.
Ngoài ra kiểm tra SMTP để đảm bảo tính chắn chắn cho các bugs khác.
node test_mail.js
→ Nếu “Mail sent successfully”, nghĩa là SMTP OK.
________________________________________
🧩 Bước 4: Mở giao diện
1.	Mở thư mục front_end/
2.	Mở file login.html hoặc register.html bằng trình duyệt
Backend đã phục vụ file tĩnh, nên bạn có thể truy cập qua:
👉 http://localhost:8000/login.html
________________________________________
🧪 5. HƯỚNG DẪN TEST TOÀN BỘ LUỒNG
	NOTE:
-	Tài khoản admin đã tạo trước:
Email: tester@gmail.com
Password: Password

-	Tài khoản user đã tạo trước:
Email: user@gmail.com	
Password: Password
🧍‍♂️ User luồng
1.	Mở register.html → đăng ký tài khoản mới
2.	Email admin (ADMIN_EMAIL) nhận được thông báo chờ duyệt
3.	User chưa thể đăng nhập (vì status = pending)
________________________________________
👨‍💼 Admin luồng
1.	Mở user_management.html
2.	Thấy user mới “Chờ duyệt”
3.	Click “Accept” → tài khoản được kích hoạt
4.	User nhận email “Tài khoản của bạn đã được duyệt”
________________________________________
🛍 User mua hàng
1.	User đăng nhập → mở user_dashboard.html
2.	Chọn sản phẩm → thanh toán → mở payment.html
3.	Quét QR, nhấn “Xác nhận đã thanh toán”
4.	Email admin nhận “Có đơn hàng chờ xác nhận”
________________________________________
💰 Admin xác nhận thanh toán
1.	Mở payment_management.html
2.	Click “Xác nhận” → hệ thống gửi email OTP cho user
3.	Nếu “Từ chối” → email báo đơn hàng bị hủy
4.	Trạng thái đơn hàng cập nhật lại trên cả giao diện user & admin
________________________________________
📤 6. CÁC MAIL GỬI TRONG HỆ THỐNG
Tình huống	Người nhận	Tiêu đề mail	Nội dung
User đăng ký	Admin	📨 “User mới chờ duyệt”	Thông tin user đăng ký
Admin duyệt user	User	 “Tài khoản đã kích hoạt”	Lời chào & thông báo đăng nhập
User xác nhận thanh toán	Admin	 “Đơn hàng chờ xác nhận”	Thông tin đơn & user
Admin xác nhận đơn hàng	User	“Mã OTP xác nhận thanh toán”	Gửi mã OTP
Admin từ chối đơn hàng	User	 “Đơn hàng bị từ chối”	Lý do & hướng xử lý
________________________________________
🧱 7. MONGODB — CÁC COLLECTION
Collection	Trường dữ liệu chính	Mục đích
users	username, email, password, admin, status	Lưu thông tin user
orders	userId, product, total, status	Lưu đơn hàng, trạng thái thanh toán
________________________________________
🧰 8. MẸO DEBUG NHANH
Vấn đề	Cách xử lý
Không gửi được mail	Kiểm tra .env SMTP, App Password
Lỗi CORS	Đặt origin: "http://localhost:5500" trong index.js
Lỗi JWT hết hạn	Dùng API /v1/auth/refresh để lấy access token mới
Không truy cập được HTML	Kiểm tra express.static("../front_end") đúng đường dẫn


