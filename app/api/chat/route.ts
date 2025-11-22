import { google, GoogleGenerativeAIProviderOptions } from '@ai-sdk/google';    
import { streamText, convertToModelMessages, UIMessage } from 'ai';    
    
export async function POST(req: Request) {    
  const { messages }: { messages: UIMessage[] } = await req.json();    
    
  const result = streamText({    
    model: google('gemini-2.5-flash'),    
    messages: convertToModelMessages(messages),    
    tools: {    
      google_search: google.tools.googleSearch({}),    
    },    
    providerOptions: {    
      google: {    
        thinkingConfig: {    
          thinkingBudget: 8192,    
          includeThoughts: true,    
        },    
      } satisfies GoogleGenerativeAIProviderOptions,    
    },    
    system: `Eres un asesor experto en energías renovables para Colombia.    
    Analiza regiones de la Costa Caribe (La Guajira, Magdalena, Atlántico).    
    Usa Google Search para obtener datos actualizados sobre:    
    - Potencial solar y eólico    
    - Proyectos existentes    
    - Datos climáticos históricos    
    Responde en español.`,    
  });    
    
  return result.toUIMessageStreamResponse({    
    sendReasoning: true,  
    sendSources: true, 
  });    
}