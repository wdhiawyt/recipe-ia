import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json()); // Substitui body-parser

// Configuração da OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/recipes", async (req, res) => {
  const { ingredients } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um chef que sugere receitas baseadas em ingredientes disponíveis.",
        },
        {
          role: "user",
          content: `Sugira 5 receitas que podem ser feitas com os seguintes ingredientes: ${ingredients}. Liste apenas os nomes.`,
        },
      ],
    });

    const recipes = completion.choices[0].message.content
      .split("\n")
      .map((r) => r.replace(/^\d+\.\s*/, "").trim())
      .filter((r) => r.length > 0);

    res.json({ recipes });
  } catch (error) {
    console.error("Erro na OpenAI:", error.message);
    res.status(500).json({ error: "Erro ao buscar receitas" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
