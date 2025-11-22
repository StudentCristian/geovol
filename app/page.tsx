'use client';  
  
import { useChat } from '@ai-sdk/react';  
import {  
  Conversation,  
  ConversationContent,  
  ConversationScrollButton,  
} from '@/components/ai-elements/conversation';  
import {  
  Message,  
  MessageContent,  
  MessageResponse,  
} from '@/components/ai-elements/message';  
import {  
  PromptInput,  
  PromptInputBody,  
  PromptInputTextarea,  
  PromptInputFooter,  
  PromptInputSubmit,  
  type PromptInputMessage,  
} from '@/components/ai-elements/prompt-input';  
import { Suggestions, Suggestion } from '@/components/ai-elements/suggestion';  
import { Loader } from '@/components/ai-elements/loader';  
import { Tool, ToolHeader, ToolContent, ToolOutput } from '@/components/ai-elements/tool';  
  
export default function ChatPage() {  
  const { messages, sendMessage, status } = useChat();  
  
  const handleSubmit = (message: PromptInputMessage) => {  
    if (message.text.trim()) {  
      sendMessage({ text: message.text });  
    }  
  };  
  
  const suggestions = [  
    "¿Cuál es el potencial eólico en La Guajira?",  
    "Analiza el potencial solar en Magdalena",  
    "Compara energía híbrida en Atlántico vs La Guajira",  
  ];  
  
  return (  
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-6">  
      <h1 className="text-2xl font-bold mb-4">Clasificador de Energía Renovable</h1>  
        
      <Conversation className="flex-1">  
        <ConversationContent>  
          {messages.length === 0 && (  
            <div className="flex flex-col items-center justify-center h-full">  
              <p className="text-gray-500 mb-4">Selecciona una pregunta o escribe tu consulta:</p>  
              <Suggestions>  
                {suggestions.map((text, i) => (  
                  <Suggestion   
                    key={i}   
                    suggestion={text}  
                    onClick={() => sendMessage({ text })}  
                  />  
                ))}  
              </Suggestions>  
            </div>  
          )}  
            
          {messages.map((message) => (  
            <Message from={message.role} key={message.id}>  
              <MessageContent>  
                {message.parts.map((part, i) => {  
                  switch (part.type) {  
                    case 'text':  
                      return (  
                        <MessageResponse key={`${message.id}-${i}`}>  
                          {part.text}  
                        </MessageResponse>  
                      );  
                      
                    case 'tool-call':  
                      return (  
                        <Tool key={`${message.id}-${i}`}>  
                          <ToolHeader   
                            title="Buscando en Google"   
                            type={part.type}  
                            state="input-available"  
                          />  
                        </Tool>  
                      );  
                      
                    case 'tool-result':  
                      return (  
                        <Tool key={`${message.id}-${i}`}>  
                          <ToolHeader   
                            title="Búsqueda completada"   
                            type={part.type}  
                            state={part.errorText ? "output-error" : "output-available"}  
                          />  
                          <ToolContent>  
                            <ToolOutput   
                              output={part.output}   
                              errorText={part.errorText}  
                            />  
                          </ToolContent>  
                        </Tool>  
                      );  
                      
                    default:  
                      return null;  
                  }  
                })}  
              </MessageContent>  
            </Message>  
          ))}  
            
          {status === 'submitted' && <Loader />}  
        </ConversationContent>  
        <ConversationScrollButton />  
      </Conversation>  
  
      <PromptInput onSubmit={handleSubmit} className="mt-4">  
        <PromptInputBody>  
          <PromptInputTextarea  
            placeholder="¿Cuál es el potencial eólico en La Guajira?"  
          />  
        </PromptInputBody>  
        <PromptInputFooter>  
          <PromptInputSubmit status={status} />  
        </PromptInputFooter>  
      </PromptInput>  
    </div>  
  );  
}