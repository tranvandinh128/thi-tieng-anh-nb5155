const express = require('express');  
const cors = require('cors');  
const app = express();  
  
app.use(cors());  
app.use(express.json());  
app.use(express.static('public')); // Chứa file index.html ở trên  
  
app.post('/api/auth/pi', async (req, res) => {  
    const { accessToken } = req.body;  
  
    if (!accessToken) {  
        return res.status(400).json({ success: false, message: "Missing access token" });  
    }  
  
    try {  
        // Xác thực token bằng cách gọi trực tiếp sang API của Pi Network  
        const piNetworkResponse = await fetch('https://api.minepi.com/v2/me', {  
            method: 'GET',  
            headers: {  
                'Authorization': `Bearer ${accessToken}`  
            }  
        });  
  
        if (!piNetworkResponse.ok) {  
            return res.status(401).json({ success: false, message: "Invalid Pi access token" });  
        }  
  
        const piUserData = await piNetworkResponse.json();  
  
        // Khởi tạo session dựa trên thông tin trả về từ Pi API  
        // piUserData mẫu: { uid: "...", username: "...", roles: [...] }  
          
        return res.status(200).json({  
            success: true,  
            message: "Authentication successful",  
            user: {  
                uid: piUserData.uid,  
                username: piUserData.username  
            }  
        });  
  
    } catch (error) {  
        console.error("Backend auth error:", error);  
        return res.status(500).json({ success: false, message: "Internal server error during validation" });  
    }  
});  
  
const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {  
    console.log(`Server running on port ${PORT}`);  
});  
