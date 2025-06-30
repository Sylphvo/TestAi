require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

async function generateAICommitMessage() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ OPENAI_API_KEY not found in environment variables. Please set GitHub Secret: OPENAI_API_KEY or .env file for local testing.");
    process.exit(1);
  }

  const commitPrompt = `You are an AI code reviewer. Generate a short and professional commit message describing recent code changes in this repository`;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-4o",
      messages: [
        { role: "user", content: commitPrompt }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const aiMessage = response.data.choices[0].message.content.trim();
    console.log(`✅ AI Generated Commit Message:${aiMessage}`);

    fs.writeFileSync('AI_COMMIT_MESSAGE.txt', aiMessage);

  } catch (error) {
    console.error("❌ Error calling OpenAI API:", error.response ? error.response.data : error.message);
    process.exit(1);
  }
}

generateAICommitMessage();