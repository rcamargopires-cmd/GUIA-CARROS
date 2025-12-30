import { GoogleGenAI } from "@google/genai";
import type { Answers, CarRecommendation } from '../types';

// Inicialização correta usando a variável de ambiente do Vite
const genAI = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY);

// Configuração do modelo (recomendado usar o 1.5-flash por ser mais rápido)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
          description: "A faixa de preço baseada na TABELA FIPE ATUAL (2024/2025) para o modelo usado (ex: R$ 50.000 - R$ 60.000).",
      },
      priceReference: {
          type: Type.STRING,
          description: "Identificação do Ano e Versão específicos usados para calcular essa faixa de preço. Ex: 'Ref: Fipe 2018 1.6 MSI', 'Ref: Fipe 2020 Turbo'.",
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
      },
      insuranceCost: {
        type: Type.STRING,
        description: "Estimativa de valor médio ANUAL do seguro (ex: R$ 2.500/ano). Considere a localização do usuário se fornecida.",
      },
      maintenanceCost: {
        type: Type.STRING,
        description: "Estimativa de custo médio de manutenção básica anual ou revisões (ex: R$ 800/revisão).",
      }
    },
    required: ["modelName", "searchTerm", "summary", "pros", "cons", "priceRange", "priceReference", "versions", "consumptionCity", "consumptionRoad", "consumerRating", "insuranceCost", "maintenanceCost"],
  },
};

function formatPrompt(answers: Answers, userLocation: string): string {
  return `
    Atue como um consultor de vendas experiente da 'Abraão Reze Seminovos'.
    
    DADOS DO CLIENTE:
    - Orçamento: ${answers.budget}
    - Uso principal: ${answers.usage}
    - Preferência de Câmbio: ${answers.transmission}
    - Maior prioridade: ${answers.priority}
    - Lotação comum: ${answers.passengers}
    - Tipo de carroceria: ${answers.bodyType}
    - LOCALIZAÇÃO DO CLIENTE: ${userLocation || "Brasil (Média Nacional)"}

    Por favor, recomende EXATAMENTE 8 carros seminovos ideais disponíveis no mercado brasileiro.

    DIRETRIZES DE ESTOQUE E MARCAS (ALTA PRIORIDADE):
    1. Dê PREFERÊNCIA MÁXIMA para sugerir modelos das seguintes marcas: **Volkswagen, Hyundai, Caoa Chery (ou Chery), Audi, Omoda e GAC**.
    2. Tente preencher a lista de recomendações prioritariamente com essas marcas.
    3. Somente sugira outras marcas (como Fiat, GM/Chevrolet, Toyota, Honda, etc) se não houver nenhuma opção viável das marcas prioritárias acima que se encaixe no orçamento e uso do cliente.

    RESTRIÇÃO DE ANO:
    - Recomende APENAS veículos fabricados a partir do ano de **2014**.

    CRITÉRIOS DE EXCLUSÃO RÍGIDOS (O QUE NÃO RECOMENDAR):
    1. TRANSMISSÃO: JAMAIS recomende carros equipados com o câmbio automatizado POWERSHIFT (Ford).
    2. FORA DE LINHA: JAMAIS recomende modelos que foram DESCONTINUADOS e não possuem mais versão 0km à venda no Brasil.
       - Exemplos PROIBIDOS: VW Gol, VW Fox, VW Voyage, VW Up!, Ford Ka, Ford Fiesta, Ford EcoSport, Toyota Etios, Honda Fit, Fiat Palio, Fiat Uno, Fiat Punto.
       - Recomende APENAS modelos que ainda estão "vivos" no mercado (ex: Polo, HB20, Onix, Creta, T-Cross, Tracker, Renegade, Compass, etc).
    
    Para cada carro, forneça os dados técnicos.
    
    **ATENÇÃO CRÍTICA AOS VALORES (Use Dados Reais/Atuais):**

    9. **PREÇO DE MERCADO (FIPE)**: 
       - Utilize a **TABELA FIPE VIGENTE (2024/2025)** como referência base para o cálculo do \`priceRange\`.
       - Ajuste para a realidade de mercado de **SEMINOVOS**.
       - **OBRIGATÓRIO**: No campo \`priceReference\`, você DEVE especificar qual ANO e VERSÃO exata usou para cotar esse valor.
         - Exemplo Correto: "Ref: Fipe 2021 1.0 Comfort", "Ref: Fipe 2019 Longitude Diesel".
         - Isso é crucial para o cliente saber se o preço é de um modelo 2015 ou 2022.

    10. **ESTIMATIVA DE SEGURO**: 
       - Use a LOCALIZAÇÃO (${userLocation}) para calibrar o valor. Se for uma capital ou região metropolitana (ex: SP, RJ), considere valores 20-30% mais altos que a média nacional.
       - Considere o perfil de risco do modelo (ex: SUVs muito visados tem seguro mais caro).
       - Formato esperado: "Aprox. R$ X.XXX/ano".

    11. **CUSTO DE MANUTENÇÃO**: 
        - Estime o custo anual de manutenção básica (troca de óleo, filtros, desgaste natural).
        - Considere a CATEGORIA do carro: Importados e Premium (Audi, Chery SUVs maiores) devem ter manutenção mais cara que populares nacionais (VW, Hyundai compactos).
        - Formato esperado: "Média R$ X.XXX/ano".
    
    Seja específico e direto nas suas recomendações.
  `;
}

/**
 * Helper function to call Gemini API with retry logic for 503 errors.
 */
async function generateContentWithRetry(modelParams: any, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await ai.models.generateContent(modelParams);
        } catch (error: any) {
            // Check for Service Unavailable (503) or Overloaded messages
            const isOverloaded = error.status === 503 || 
                                 error.code === 503 || 
                                 (error.message && (error.message.includes('503') || error.message.includes('overloaded'))) ||
                                 error.status === 429; // Also retry on Too Many Requests

            if (isOverloaded && i < retries - 1) {
                // Exponential backoff: 1s, 2s, 4s...
                const delay = Math.pow(2, i) * 1000 + Math.random() * 500;
                console.warn(`Gemini API overloaded (Attempt ${i + 1}/${retries}). Retrying in ${delay.toFixed(0)}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }
}

export async function getCarRecommendations(answers: Answers, userLocation: string): Promise<CarRecommendation[]> {
  // Passamos a localização para o formatPrompt
  const prompt = formatPrompt(answers, userLocation);

  try {
    const response = await generateContentWithRetry({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, // Reduzido ligeiramente para ser mais preciso nos valores Fipe
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

export async function getCarRecommendationsFromAudio(base64Audio: string, mimeType: string, userLocation: string): Promise<CarRecommendation[]> {
  const promptText = `
    Atue como um consultor de vendas experiente da 'Abraão Reze Seminovos'.
    
    O usuário forneceu um áudio descrevendo o que procura em um carro seminovo.
    A localização do usuário é: ${userLocation || "Média Nacional"}.

    Ouça com atenção e identifique:
    - Orçamento (se não mencionado, deduza um valor médio razoável).
    - Uso principal.
    - Preferência de Câmbio (Manual ou Automático).
    - Preferências Gerais.

    Com base no que você ouviu, recomende EXATAMENTE 8 carros seminovos ideais.

    DIRETRIZES DE ESTOQUE E MARCAS (ALTA PRIORIDADE):
    1. Dê PREFERÊNCIA MÁXIMA para modelos das marcas: **Volkswagen, Hyundai, Caoa Chery (ou Chery), Audi, Omoda e GAC**.
    2. Tente preencher a lista com essas marcas. Só sugira outras marcas se as prioritárias não atenderem ao pedido.

    RESTRIÇÃO DE ANO:
    - Recomende APENAS veículos fabricados a partir de **2014**.

    CRITÉRIOS DE EXCLUSÃO RÍGIDOS: 
    1. JAMAIS recomende carros equipados com o câmbio automatizado POWERSHIFT.
    2. JAMAIS recomende carros FORA DE LINHA (descontinuados).
       - Não sugira: Gol, Fox, Voyage, Ka, Fiesta, Ecosport, Etios, Fit, Uno, Palio, etc.
       - Sugira APENAS modelos que ainda estão em produção.

    **CÁLCULO DE CUSTOS E VALORES (FIPE):**
    - **Preço (priceRange)**: Utilize obrigatoriamente a **Tabela Fipe VIGENTE (2024/2025)**.
    - **Referência de Preço (priceReference)**: Indique CLARAMENTE o ano e versão base do preço (ex: "Ref: Fipe 2018 1.0 Flex").
    - **Seguro Anual**: Utilize a localização (${userLocation}) para estimar.
    - **Manutenção Anual**: Considere a complexidade mecânica.

    Preencha todos os campos do esquema JSON solicitado.
  `;

  try {
    const response = await generateContentWithRetry({
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
        temperature: 0.3, // Reduzido para precisão nos dados numéricos
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
