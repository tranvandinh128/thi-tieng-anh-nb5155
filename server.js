const express = require('express');  
const cors = require('cors');  
const session = require('express-session');  
  
const app = express();  
const PORT = 5000;  
  
app.use(cors());  
app.use(express.json());  
app.use(session({  
  secret: 'chuoi-bi-mat-cua-ban',  
  resave: false,  
  saveUninitialized: true  
}));  
  
// Endpoint xử lý và xác thực token từ Pi Network gửi lên  
app.post('/api/auth/pi', async (req, res) => {  
  const { accessToken } = req.body;  
  
  if (!accessToken) {  
    return res.status(400).json({ error: 'Thừa hành động, thiếu access token' });  
  }  
  
  try {  
    // Gọi lệnh GET tới Pi API với chuỗi Authorization: Bearer <accessToken> để xác thực  
    const piApiResponse = await fetch('https://api.minepi.com/v2/me', {  
      method: 'GET',  
      headers: {  
        'Authorization': `Bearer ${accessToken}`  
      }  
    });  
  
    if (!piApiResponse.ok) {  
      const errText = await piApiResponse.text();  
      return res.status(401).json({ error: 'Pi Access Token không hợp lệ', details: errText });  
    }  
  
    const piUserData = await piApiResponse.json();  
  
    // Thiết lập session (phiên đăng nhập) sau khi kiểm tra thành công  
    req.session.user = {  
      uid: piUserData.uid,  
      username: piUserData.username  
    };  
  
    return res.status(200).json({   
      success: true,   
      user: req.session.user   
    });  
  
  } catch (error) {  
    console.error('Lỗi xác thực phía Backend:', error);  
    return res.status(500).json({ error: 'Lỗi hệ thống nội bộ' });  
  }  
});  
  
app.listen(PORT, () => {  
  console.log(`Server đang chạy ổn định tại cổng ${PORT}`);  
});  
