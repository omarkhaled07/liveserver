const express = require('express');
const { AccessToken } = require('livekit-server-sdk');
require('dotenv').config();

const app = express();
app.use(express.json());

const apiKey = process.env.LIVEKIT_API_KEY;
const apiSecret = process.env.LIVEKIT_API_SECRET;
const livekitUrl = process.env.LIVEKIT_URL;

app.post('/get-token', (req, res) => {
    const { identity, room } = req.body;
    if (!identity || !room) {
        return res.status(400).json({ error: 'Identity and room are required' });
    }

    try {
        const token = new AccessToken(apiKey, apiSecret, { identity });
        token.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true });

        res.json({ token: token.toJwt() });
    } catch (error) {
        res.status(500).json({ error: 'Error generating token' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
