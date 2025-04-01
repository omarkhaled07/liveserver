const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());  // لمعالجة JSON في الطلبات
app.use(express.urlencoded({ extended: true }));  // لمعالجة الطلبات المرسلة بـ x-www-form-urlencoded

// تحقق من وجود المتغيرات البيئية المطلوبة
if (!process.env.LIVEKIT_URL || !process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    console.error("❌ تأكد من ضبط LIVEKIT_URL, LIVEKIT_API_KEY, و LIVEKIT_API_SECRET في .env");
    process.exit(1);
}

// API لإنشاء التوكين
app.post('/get-token', (req, res) => {
    console.log("📥 Received request body:", req.body); // لطباعة الطلب في اللوج

    const { identity, room } = req.body;
    if (!identity || !room) {
        return res.status(400).json({ error: "❌ Missing identity or room" });
    }

    try {
        // إنشاء Access Token
        const token = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
            identity,
        });
        token.addGrant({ roomJoin: true, room });

        // إرسال التوكين في الاستجابة
        res.json({ token: token.toJwt() });
    } catch (error) {
        console.error("❌ Error generating token:", error);
        res.status(500).json({ error: "خطأ أثناء إنشاء التوكين" });
    }
});

// تشغيل السيرفر على Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
