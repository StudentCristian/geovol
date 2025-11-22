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
import { Tool, ToolHeader, ToolContent, ToolInput, ToolOutput } from '@/components/ai-elements/tool';  
import { Reasoning, ReasoningTrigger, ReasoningContent } from '@/components/ai-elements/reasoning';  
import { Sources, SourcesTrigger, SourcesContent, Source } from '@/components/ai-elements/sources';  
import {   
  InlineCitation,   
  InlineCitationText,  
  InlineCitationCard,  
  InlineCitationCardTrigger,  
  InlineCitationCardBody,  
  InlineCitationCarousel,  
  InlineCitationCarouselContent,  
  InlineCitationCarouselItem,  
  InlineCitationCarouselHeader,  
  InlineCitationCarouselIndex,  
  InlineCitationCarouselPrev,  
  InlineCitationCarouselNext,  
  InlineCitationQuote,  
  InlineCitationSource  
} from '@/components/ai-elements/inline-citation';  
  
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
              <p className="text-gray-500 mb-4">Selecciona una pregunta o escribe tu consulta</p>  
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
            
          {messages.map((message) => {  
            // Extraer las fuentes completas (no solo URLs)  
            const sourceParts = message.parts.filter(p => p.type === 'source-url');  
            const sourceUrls = sourceParts.map(p => p.url);  
  
            return (  
              <div key={message.id}>  
                {/* Sources Component - Usar title de las fuentes */}  
                {message.role === 'assistant' && sourceParts.length > 0 && (  
                  <Sources>  
                    <SourcesTrigger count={sourceParts.length} />  
                    <SourcesContent>  
                      {sourceParts.map((part, i) => (  
                        <Source   
                          key={i}  
                          href={part.url}  
                          title={part.title || 'Fuente sin título'}  
                        />  
                      ))}  
                    </SourcesContent>  
                  </Sources>  
                )}  
  
                {/* Message Component */}  
                <Message from={message.role} key={message.id}>  
                  <MessageContent>  
                    {message.parts.map((part, i) => {  
                      switch (part.type) {  
                        case 'text':  
                          return (  
                            <InlineCitation key={`${message.id}-${i}`}>  
                              <InlineCitationText>  
                                <MessageResponse>{part.text}</MessageResponse>  
                              </InlineCitationText>  
                                
                              {sourceUrls.length > 0 && (  
                                <InlineCitationCard>  
                                  <InlineCitationCardTrigger sources={sourceUrls} />  
                                  <InlineCitationCardBody>  
                                    <InlineCitationCarousel>  
                                      <InlineCitationCarouselHeader>  
                                        <InlineCitationCarouselIndex />  
                                        <div className="flex gap-2">  
                                          <InlineCitationCarouselPrev />  
                                          <InlineCitationCarouselNext />  
                                        </div>  
                                      </InlineCitationCarouselHeader>  
                                      <InlineCitationCarouselContent>  
                                        {sourceParts.map((sourcePart, idx) => (  
                                          <InlineCitationCarouselItem key={idx}>  
                                            <InlineCitationQuote>  
                                              Fuente de información verificada  
                                            </InlineCitationQuote>  
                                            <InlineCitationSource   
                                              url={sourcePart.url}  
                                              title={sourcePart.title || 'Fuente sin título'}  
                                            />  
                                          </InlineCitationCarouselItem>  
                                        ))}  
                                      </InlineCitationCarouselContent>  
                                    </InlineCitationCarousel>  
                                  </InlineCitationCardBody>  
                                </InlineCitationCard>  
                              )}  
                            </InlineCitation>  
                          );  
                          
                        case 'reasoning':  
                          return (  
                            <Reasoning key={`${message.id}-${i}`} isStreaming={status === 'streaming'}>  
                              <ReasoningTrigger />  
                              <ReasoningContent>{part.text}</ReasoningContent>  
                            </Reasoning>  
                          );  
                          
                        case 'tool-call':  
                          return (  
                            <Tool key={`${message.id}-${i}`}>  
                              <ToolHeader   
                                title="Buscando en Google"   
                                type={part.type}  
                                state="input-available"  
                              />  
                              <ToolContent>  
                                <ToolInput input={part.input} />  
                              </ToolContent>  
                            </Tool>  
                          );  
                          
                        case 'tool-result':  
                          return (  
                            <Tool key={`${message.id}-${i}`} defaultOpen={true}>  
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
                          
                        case 'source-url':  
                          return null; // Ya se muestran en Sources  
                          
                        default:  
                          return null;  
                      }  
                    })}  
                  </MessageContent>  
                </Message>  
              </div>  
            );  
          })}  
            
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