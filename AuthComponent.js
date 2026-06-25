import React, { useEffect, useState } from 'react';  
  
const AuthComponent = () => {  
  const [user, setUser] = useState(null);  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null);  
  
  const handlePiAuth = async () => {  
    if (!window.Pi) {  
      setError("Pi SDK chưa được tải. Hãy mở ứng dụng bằng Pi Browser.");  
      return;  
    }  
  
    setLoading(true);  
    setError(null);  
  
    try {  
      // 1. Chờ Pi.init() chạy xong hoàn toàn như một Promise  
      await window.Pi.init({ version: "2.0", sandbox: true });  
  
      // 2. Sử dụng scope 'username'  
      const scopes = ['username'];  
      const onIncompletePaymentFound = (payment) => { };  
  
      const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);  
        
      // 3. Gửi access token lên backend để xác thực  
      const response = await fetch('https://ten-mien-backend-cua-ban.com/api/auth/pi', {  
        method: 'POST',  
        headers: {  
          'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({ accessToken: authResult.accessToken }),  
      });  
  
      if (!response.ok) {  
        throw new Error('Đăng nhập phía máy chủ thất bại');  
      }  
  
      const sessionData = await response.json();  
      setUser(sessionData.user);  
    } catch (err) {  
      console.error("Pi Auth Error:", err);  
      setError(err.message || "Xác thực thất bại");  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  // Tự động kích hoạt khi ứng dụng tải xong  
  useEffect(() => {  
    handlePiAuth();  
  }, []);  
  
  return (  
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>  
      {loading && <p>Đang kết nối với Pi Network...</p>}  
      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}  
        
      {user ? (  
        <div>  
          <h2>Xin chào, {user.username}!</h2>  
          <p>UID của bạn: {user.uid}</p>  
        </div>  
      ) : (  
        !loading && (  
          <div>  
            <p>Bạn chưa đăng nhập.</p>  
            {/* Nút bấm để người dùng kích hoạt thủ công */}  
            <button   
              onClick={handlePiAuth}   
              style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '5px' }}  
            >  
              Đăng nhập bằng Pi  
            </button>  
          </div>  
        )  
      )}  
    </div>  
  );  
};  
  
export default AuthComponent;  
