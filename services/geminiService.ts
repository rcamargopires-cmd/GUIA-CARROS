
import { GoogleGenAI, Type } from "@google/genai";
import type { Answers, CarRecommendation } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Shared Schema for both text and audio based recommendations
const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      modelName: {
        type: Type.STRING,
        description: "O nome completo do modelo para exibição. Ex: 'Hyundai HB20', 'Jeep Renegade'.",
      },
      searchTerm: {
        type: Type.STRING,
        description: "O termo genérico para busca no site. DEVE ser apenas o nome do modelo, sem marca. Ex: 'hb20', 'gol', 'creta', 'mobi', 't-cross'.",
      },
      summary: {
        type: Type.STRING,
        description: "Um parágrafo curto explicando por que este carro é uma boa recomendação para o usuário.",
      },
      pros: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "Uma lista com exatamente 3 pontos positivos sobre o carro.",
      },
      cons: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING,
        },
        description: "Uma lista com exatamente 3 pontos negativos sobre o carro.",
      },
      priceRange: {
          type: Type.STRING,
          description: "A faixa estimada de preço de mercado (ex: R$ 50.000 - R$ 60.000).",
      },
      versions: {
          type: Type.ARRAY,
          items: {
              type: Type.OBJECT,
              properties: {
                  name: { type: Type.STRING, description: "Nome da versão (ex: Comfort 1.0)" },
                  features: { type: Type.STRING, description: "Principais diferenciais e equipamentos desta versão." }
              },
              required: ["name", "features"]
          },
          description: "Lista das principais versões e suas diferenças.",
      },
      consumptionCity: {
          type: Type.STRING,
          description: "Consumo médio urbano com gasolina (ex: 10 km/l).",
      },
      consumptionRoad: {
          type: Type.STRING,
          description: "Consumo médio rodoviário com gasolina (ex: 14 km/l).",
      },
      consumerRating: {
        type: Type.NUMBER,
        description: "Nota média de satisfação dos donos (de 0.0 a 5.0), baseada na reputação geral em sites especializados.",
      }
    },
    required: ["modelName", "searchTerm", "summary", "pros", "cons", "priceRange", "versions", "consumptionCity", "consumptionRoad", "consumerRating"],
  },
};

function formatPrompt(answers: Answers): string {
  return `
    Atue como um consultor de vendas experiente da 'Abraão Reze Seminovos'.
    Com base nas seguintes preferências de um consumidor:
    - Orçamento: ${answers.budget}
    - Uso principal: ${answers.usage}
    - Maior prioridade: ${answers.priority}
    - Lotação comum: ${answers.passengers}
    - Tipo de carroceria: ${answers.bodyType}

    Por favor, recomende EXATAMENTE 5 carros seminovos ideais disponíveis no mercado brasileiro (focando em modelos com boa liquidez e comuns em estoques de grandes revendas como a Abraão Reze).

    CRITÉRIO DE EXCLUSÃO RÍGIDO: JAMAIS recomende carros equipados com o câmbio automatizado POWERSHIFT (comuns em modelos Ford como Fiesta, Focus e EcoSport de certos anos). Exclua esses modelos preventivamente devido ao histórico de problemas mecânicos.
    
    Para cada carro, forneça:
    1. O nome do modelo para exibição (Ex: Honda Civic, Toyota Corolla).
    2. O termo de busca SIMPLIFICADO para o site (Ex: "Civic", "Corolla", "HB20", "Gol", "Mobi" - APENAS o nome principal do modelo, sem a marca e sem versão).
    3. Um resumo conciso explicando por que ele é uma boa escolha para este perfil.
    4. Uma lista de 3 pontos positivos (prós).
    5. Uma lista de 3 pontos negativos (contras).
    6. A faixa de preço de mercado estimada para seminovos deste modelo dentro do orçamento (Ex: "R$ 45.000 - R$ 55.000").
    7. Uma lista das 3 principais VERSÕES encontradas nessa faixa de preço. Para cada versão, informe o NOME e os principais DIFERENCIAIS/EQUIPAMENTOS que a distinguem (ex: Nome: "LXR 2.0", Diferenciais: "Motor 2.0, Câmbio Borboleta, Bancos em Couro").
    8. Consumo médio estimado na CIDADE com gasolina (ex: "10.5 km/l").
    9. Consumo médio estimado na ESTRADA com gasolina (ex: "14.2 km/l").
    10. Uma nota de satisfação do consumidor (0.0 a 5.0) baseada na reputação geral do modelo em sites como iCarros, Webmotors e Quatro Rodas.
    
    Seja específico e direto nas suas recomendações.
  `;
}

export async function getCarRecommendations(answers: Answers): Promise<CarRecommendation[]> {
  const prompt = formatPrompt(answers);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (!Array.isArray(result)) {
        throw new Error("A resposta da API não é um array.");
    }

    return result as CarRecommendation[];

  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    throw new Error("Falha ao obter recomendações da IA.");
  }
}

export async function getCarRecommendationsFromAudio(base64Audio: string, mimeType: string): Promise<CarRecommendation[]> {
  const promptText = `
    Atue como um consultor de vendas experiente da 'Abraão Reze Seminovos'.
    
    O usuário forneceu um áudio descrevendo o que procura em um carro seminovo.
    Ouça com atenção e identifique:
    - Orçamento (se não mencionado, deduza um valor médio razoável baseado no tipo de carro que ele pede).
    - Uso principal (trabalho, família, viagens, etc).
    - Preferências de estilo, marca ou categoria.

    Com base no que você ouviu, recomende EXATAMENTE 5 carros seminovos ideais disponíveis no mercado brasileiro.

    CRITÉRIO DE EXCLUSÃO RÍGIDO: JAMAIS recomende carros equipados com o câmbio automatizado POWERSHIFT.

    Inclua para cada carro uma nota de satisfação do consumidor (0.0 a 5.0) baseada na reputação online do veículo.
    
    Preencha todos os campos do esquema JSON solicitado com base na sua análise do áudio. Se o usuário foi vago, ofereça as melhores opções gerais para o contexto dele.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Audio
                }
            },
            { text: promptText }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (!Array.isArray(result)) {
        throw new Error("A resposta da API não é um array.");
    }

    return result as CarRecommendation[];
  } catch (error) {
     console.error("Erro ao chamar a API Gemini com áudio:", error);
     throw new Error("Falha ao processar o áudio e obter recomendações.");
  }
}