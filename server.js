const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');
require('dotenv').config();

const app = express();

// ✅ استخدم الـ Middleware بالترتيب الصحيح
app.use(cors());
app.use(express.json());  // لمعالجة JSON في الطلبات
app.use(express.urlencoded({ extended: true }));  // لمعالجة x-www-form-urlencoded

// 🔹 التحقق من وجود متغيرات البيئة
if (!process.env.LIVEKIT_URL || !process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    console.error("❌ تأكد من ضبط LIVEKIT_URL, LIVEKIT_API_KEY, و LIVEKIT_API_SECRET في .env");
    process.exit(1);
}

// ✅ API لإنشاء التوكين
app.post('/get-token', (req, res) => {
    console.log("📥 Received request body:", req.body);  // ✅ طباعة الطلب لفحص المشكلة

    const { identity, room } = req.body;

    if (!identity || !room) {
        return res.status(400).json({ error: "❌ Missing identity or room" });
    }

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

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
