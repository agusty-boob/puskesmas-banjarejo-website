const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config(); // Load .env

const app = express();
app.use(cors());
app.use(express.json());

// Inisialisasi OpenAI (SDK baru — tanpa Configuration)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint untuk chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // Ganti model jika perlu
      messages: [
        {
          role: "system",
          content:
            "Anda adalah asisten kesehatan AI. Berikan jawaban medis yang akurat dan jelas dalam Bahasa Indonesia. Ingatkan bahwa ini bukan pengganti dokter."
        },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices?.[0]?.message?.content ?? "";
    res.json({ reply });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
