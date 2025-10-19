"""
server.py
Flask app hiển thị giao diện Login → Register → Dashboard.
Không có xử lý backend, chỉ dùng frontend và chuyển trang.
"""

from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__, template_folder='front_end')

# --------------------------------------------------
# Trang mặc định → chuyển về /login
# --------------------------------------------------
@app.route('/')
def root():
    return redirect(url_for('login'))

# --------------------------------------------------
# Trang đăng nhập
# --------------------------------------------------
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Giả lập xác thực (chưa có DB)
        email = request.form['email']
        password = request.form['password']

        if email == "admin@example.com" and password == "123456":
            return redirect(url_for('admin_dashboard'))
        elif email == "user@example.com" and password == "123456":
            return redirect(url_for('dashboard'))
        else:
            error = "Sai tài khoản hoặc mật khẩu!"
            return render_template('login.html', error=error)
    return render_template('login.html')

# --------------------------------------------------
# Trang đăng ký
# --------------------------------------------------
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # Giả lập xử lý đăng ký
        return redirect(url_for('login'))
    return render_template('register.html')

# --------------------------------------------------
# Dashboard (trang chính sau khi login)
# --------------------------------------------------
@app.route('/dashboard')
def dashboard():
    return render_template('user_dashboard.html')

# --------------------------------------------------
# Dashboard của admin
# --------------------------------------------------
@app.route('/admin_dashboard')
def admin_dashboard():
    return render_template('admin.html')

# --------------------------------------------------
# Trang thanh toán đơn 
# --------------------------------------------------
@app.route('/payment')
def payment():
    return render_template('payment.html')

# --------------------------------------------------
# Trang quản lý thông tin người dùng
# --------------------------------------------------
@app.route('/admin/users')
def admin_users():
    return render_template('user_management.html')

# --------------------------------------------------
# Trang quản lý thông tin thanh toán
# --------------------------------------------------
@app.route('/admin/payments')
def admin_payments():
    return render_template('payment_management.html')

# --------------------------------------------------
# Đăng xuất → trở về login
# --------------------------------------------------
@app.route('/logout')
def logout():
    return redirect(url_for('login'))

# --------------------------------------------------
if __name__ == '__main__':
    app.run(debug=True, port = 8000)
    