const express = require("express");
const dotenv = require("dotenv");
const app = express();
const port = 3000;
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function getResponse(prompt) {
  const API_KEY = "AIzaSyDe8fDZPoSjPgSye8s-DWpi7GpB0njFVao";
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  // console.log(result.response);
  return result;
}

app.post("/api/gemini/prompt/send", async (req, res) => {
  try {
    const { prompt } = req.body;
    // console.log(prompt);
    if (!prompt || prompt == "")
      return res.status(400).json({
        message: "Please send a valid prompt",
      });

    const aiResponse = await getResponse(prompt);
    return res.status(200).json({
      response: `${aiResponse}`,
    });
  } catch (err) {
    console.error(`Error occurred in file: index.js, function: post -`, err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

module.exports = { app };
