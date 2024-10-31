import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import childRoutes from "./routes/childRoutes.js";
import recordRoutes from "./routes/recordRoutes.js";
import OpenAI from "openai";
import bodyParser from "body-parser";

const app = express();

// Increase the limit for JSON and URL-encoded bodies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Optional: Remove bodyParser if using express built-in methods
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/children", childRoutes);
app.use("/api/records", recordRoutes);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/nutrition-analysis", async (req, res) => {
  try {
    const { image, prompt } = req.body;

    // Validasi input
    if (!image || !prompt) {
      return res.status(400).json({ error: "Gambar dan prompt diperlukan" });
    }

    // Optional: Add additional validation for image size if needed
    const maxImageSize = 50 * 1024 * 1024; // 50MB
    if (image.length > maxImageSize) {
      return res.status(413).json({ error: "Ukuran gambar terlalu besar" });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
    });

    res.json({
      analysis: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({
      error: "Gagal menganalisis gambar",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
