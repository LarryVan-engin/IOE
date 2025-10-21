<img width="1919" height="1079" alt="Screenshot 2025-10-20 164016" src="https://github.com/user-attachments/assets/1fe5d62e-534d-488d-ad34-7c8076bf4bb3" />web nằm trong mục smtp-main/

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


 
Đây chính là giao diện trang login.html để Đăng nhập
Nếu chưa có tài khoản, chọn Đăng ký ngay

<img width="1919" height="1079" alt="Screenshot 2025-10-20 164016" src="https://github.com/user-attachments/assets/f25143fe-f5c1-4afe-881e-0eebd0d9730d" />

Đây là giao diện đăng ký tài khoản, điền các field (bắt buộc).

<img width="1919" height="1079" alt="Screenshot 2025-10-20 164122" src="https://github.com/user-attachments/assets/39d0e389-438c-4f91-b418-6d8ab628a983" />

TEST CASE:
-	Nếu bỏ trống, báo lỗi
-	Nếu nhập ‘Họ và tên’ :
	+ dưới 4 ký tự, báo lỗi…
	+ Trùng với tên có sẵn, báo lỗi
-	Nếu nhập ‘Tên người dùng’:
	+ dưới 4 ký tự, báo lỗi…
	+ Trùng tên người khác, báo lỗi
-	Nếu nhập địa chỉ email:
	+ không đúng đuôi @domain, báo lỗi…
	+ Trùng email có sẵn, báo lỗi
-	Nếu nhập ‘Số điện thoại’: 
	+ dưới 10 số, báo lỗi…
	+ Trùng số điện thoại, báo lỗi…
-	Nếu nhập mật khẩu: dưới 6 ký tự, báo lỗi
-	Confirm mật khẩu: nhập sai, báo lỗi.
 
Sau khi điền các fields và nhấn Đăng ký, web sẽ hiện thông báo Đăng ký thành công
<img width="581" height="916" alt="Screenshot 2025-10-20 164935" src="https://github.com/user-attachments/assets/34e5c40d-365d-4d72-ba1f-f24b0bb93241" />

Tuy nhiên sau bước Đăng ký này, user mới vẫn chưa được đăng nhập vào mà phải đợi admin duyệt tài khoản thì mới được đăng nhập.
TEST: Nếu chưa được duyệt thì khi đăng nhập sẽ thế nào
 <img width="638" height="574" alt="Screenshot 2025-10-20 165355" src="https://github.com/user-attachments/assets/e7498e59-9977-4255-9bf0-0c2aafc09f9f" />

	Có thể thấy khi chưa được admin accept thì hệ thống sẽ không cho phép đăng nhập.
ADMIN: 
Sau khi user mới đăng ký thì admin sẽ được nhận thông báo qua mail:
<img width="895" height="486" alt="Screenshot 2025-10-20 165545" src="https://github.com/user-attachments/assets/b199a4ca-ba34-4a62-a97a-9096af0f0bd0" />

Với email admin được thiết lập sẵn, sau khi được nhận thông báo nêu rõ về user mới, ta Đăng nhập vào với tài khoản admin.
 <img width="1919" height="966" alt="Screenshot 2025-10-20 165937" src="https://github.com/user-attachments/assets/cc8cdc69-a7a1-45ec-a99f-684e2950e628" />

Giao diện tài khoản admin.html sẽ khác với giao diện của user_dashboard.html, có các mục Quản lý.
Chọn Quản lý người dùng
 <img width="1919" height="751" alt="Screenshot 2025-10-20 170152" src="https://github.com/user-attachments/assets/4195ae0f-d6f0-4393-acac-480cf47e13b0" />

Ở đây ta sẽ thấy user mới đang hiện thông báo trạng thái là “pending” và cần admin chọn các tác vụ là Accept hay Reject
TEST: Nếu chọn Reject, tài khoản mới sẽ bị xóa và không lưu lại trong hệ thống.
<img width="1518" height="890" alt="Screenshot 2025-10-20 170438" src="https://github.com/user-attachments/assets/36db4b4c-7db3-44fc-a82d-5352ae8cdcd1" />
	Nếu chọn Accept, tài khoản mới sẽ được chấp thuận đăng nhập vào user_dashboard
 <img width="1906" height="1079" alt="Screenshot 2025-10-20 170456" src="https://github.com/user-attachments/assets/da71f60e-34a7-4c35-82a2-0980483a6c5e" />

Giao diện user_dashboard sẽ có các mục giao dịch và thanh toán. Nếu chọn mua gói nào thì sẽ báo giá Xác nhận thanh toán, sau đó sẽ gửi Email thanh toán đến admin về giá gói hàng.
 

 <img width="1919" height="1079" alt="Screenshot 2025-10-20 170644" src="https://github.com/user-attachments/assets/23f8f3fa-5917-4d46-9314-f1bbeceef66e" />

Ngay lập tức tài khoản email admin sẽ nhận thông báo:
 <img width="1175" height="652" alt="Screenshot 2025-10-20 170733" src="https://github.com/user-attachments/assets/26530641-deae-4495-bdfd-c32a332f47b1" />

Sau khi nhận email, admin sẽ thao tác truy cập vào Quản lý đơn hàng để xem xét về đơn hàng:
 <img width="1919" height="1058" alt="Screenshot 2025-10-20 174208" src="https://github.com/user-attachments/assets/f4f4a518-42b3-4cff-824c-10d2073ebd8e" />

Vì đã mã hóa mã GD, chỉ xem được tên người dùng, có thể thấy các trạng thái của đơn hàng.
Admin sẽ thao tác Xác nhận hoặc Từ chối:
 <img width="1919" height="1073" alt="Screenshot 2025-10-20 174327" src="https://github.com/user-attachments/assets/c68f0442-17df-482e-8023-6c4771cd78c0" />

TEST: Từ chối đơn hàng
 <img width="1512" height="942" alt="Screenshot 2025-10-20 174407" src="https://github.com/user-attachments/assets/bc149aee-5b03-44b1-84ef-689523749ad4" />
Sau khi từ chối, lập tức email từ chối đơn hàng được gửi về user.
 
TEST: Xác nhận đơn hàng
 <img width="1919" height="1061" alt="Screenshot 2025-10-20 174451" src="https://github.com/user-attachments/assets/d35b8d8a-0717-470f-b427-f3e0398acb78" />

Sau khi xác nhận đơn hàng, ngay lập tức email xác nhận được gửi về cho user kèm mã OTP.
<img width="1542" height="950" alt="Screenshot 2025-10-20 174539" src="https://github.com/user-attachments/assets/b5f09253-f3c2-42ec-a5cc-5257717b54a6" />
<img width="1902" height="1079" alt="Screenshot 2025-10-20 180355" src="https://github.com/user-attachments/assets/41fe8a51-d169-41b0-8427-4c1e5e263049" />

Mã OTP này sẽ để phát triển bảo mật sản phẩm cho user, nhằm đảm bảo tính độc quyền của sản phẩm.




