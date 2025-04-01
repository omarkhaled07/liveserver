require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { AccessToken } = require('livekit-server-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;

app.post('/get-token', (req, res) => {
    const { identity, room } = req.body;

    if (!identity || !room) {
        return res.status(400).json({ error: 'Identity and room are required' });
    }

    const at = new AccessToken(apiKey, apiSecret, { identity });
    at.addGrant({ roomJoin: true, canPublish: true, room });

    res.json({ token: at.toJwt() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
