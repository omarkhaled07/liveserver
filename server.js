const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');
require('dotenv').config();

const app = express();

// ✅ تأكد من تفعيل تحليل JSON قبل أي طلب
app.use(cors());
app.use(express.json());  // معالجة JSON
app.use(express.urlencoded({ extended: true }));  // معالجة x-www-form-urlencoded

app.post('/get-token', (req, res) => {
    console.log("📥 Received request body:", req.body);  // ✅ طباعة الطلب للتحقق

    // ✅ تأكد من أن body يحتوي على القيم المطلوبة
    if (!req.body || !req.body.identity || !req.body.room) {
        return res.status(400).json({ error: "❌ Missing identity or room" });
    }

    const { identity, room } = req.body;

    try {
        const token = new AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
            identity,
        });
        token.addGrant({ roomJoin: true, room });

        res.json({ token: token.toJwt() });
    } catch (error) {
        console.error("❌ Error generating token:", error);
        res.status(500).json({ error: "خطأ أثناء إنشاء التوكين" });
    }
});

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
