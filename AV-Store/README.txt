>>>> Hướng dẫn chạy source code:
	1. Truy cập vào thư mục "AV-Store".
	2. Trong thư mục "AV-Store" sẽ lần lượt có 3 thư mục là: "api", "admin", "client".
	3. Truy cập lần lượt vào từng thư mục và mở cmd bằng cách gõ cmd trên đường dẫn thư mục
	4. Tại thư mục "api" gõ dòng lệnh "npm install --legacy-peer-deps".
	5. Tại thư mục "admin" và "client" gõ dòng lệnh "npm install".
	6. Sau khi tất cả thư viện được cài đặt thành công thì gõ dòng lệnh "npm start" tại tất cả
	cmd của các thư mục đó.
	> Lưu ý: phải cài đặt node trước đó.

>>>> Hướng dẫn cấu hình cho cơ chế gửi gmail (Sử dụng OAuth2 của Google): (Nếu chỉ xem UI/UX thì có thể bỏ qua bước này)
	1. Tạo ứng dụng trên Google Cloud Console bằng cách truy cập https://console.cloud.google.com đăng nhập tài khoản google của bạn
	2. Click Select a project chọn NEW PROJECT ở tay phải nhập tên và nhấn tạo
	3. Mở Menu (góc trên cùng bên trái) 
		> Chọn APIs & Services 
		> Credentials 
		> Create Credentials 
		> OAuth client ID
	4. Nếu thấy màn hình tiếp theo thông báo là: “To create an OAuth client ID, you must first configure your consent screen“, thì cứ nhấn cái button Configure Consent Screen.
	5. Chọn User Type là External rồi nhấn Create
	6. Nhập tên app và vài require trên đầu những field còn lại có thể để trống 
		> Nhấn Save cho qua bước 2,3,4 và cuối cùng nút Back To Dashboard
	7. Chọn Credentials 
		> Create Credentials 
		> OAuth client ID
	8. Application type chọn Web application
	9. Đặt tên tùy ý, Authorized JavaScript Origins thì để trống, Authorized Redirect URIs thì điền link sau vào: https://developers.google.com/oauthplayground 
		> Nhấn Create
	10. Màn hình sẽ hiển thị Client ID và Client Secret 
		> Copy lại và đổi CLIENT_ID, CLIENT_SECRET ở file AV-Store/api/.env 
		> Lưu file lại 
	11. Tại phần APIs & Services 
		> OAuth consent screen kéo xuống chọn Add users 
		> Nhập email để test 
		> Save 
	12. Truy cập vào https://developers.google.com/oauthplayground 
		> Click vào icon Setting ở góc trên bên phải màn hình 
		> Tích vào: Use your own OAuth credenticals 
		> Copy và Paste đúng 2 cái Client ID và Client Secret vừa tạo 
		> nhấn close
	13. Quay sang phần bên trái màn hình trong ô Input your own scopes 
		> Nhập https://mail.google.com 
		> Authorize APIs và chọn địa chỉ email đã nhập ở bước 11 
		> Nhấn "Tiếp tục" > "Tiếp tục"
	14. Tiếp tục quay lại trang playground 
		> Tích vào nút checkbox Auto-refresh the token before it expires 
		> Nhấn button: Exchange authorization code for tokens 
		> Copy Refresh Token
	15. Truy cập vào file AV-Store/api/.env đổi giá trị cho REFRESH_TOKEN 
		> Lưu file 
	16. Truy cập vào file AV-Store/api/.env/config/mail.js ở dòng 21 đổi email đã chọn ở bước 11 > Lưu file

>>>> Truy cập đường dẫn website:
	+ Phía khách hàng: http://localhost:3000
	+ Phía quản lý: http://localhost:8080

>>>> Tài khoản sử dụng:
	Admin: (email - mật khẩu)	
		hoangvunguyen01@gmail.com - admin123
	
	Client: (email - mật khẩu)
		truonganhvnbd1999@gmail.com - truonganh