// Utility function to format bot responses without repetitive content
export function formatBotResponse(response: string, context: string): string {
    // Remove repetitive origin mentions
    const cleanResponse = response.replace(
      /(born on Pump\.fun|created on Pump\.fun|originated from Pump\.fun)/gi, 
      ''
    );
    
    // Remove repetitive agent listings
    const withoutAgents = cleanResponse.replace(
      /(CHRONOS, PARADOX, NEXUS, and CIPHER|my four quantum agents|my agents)/gi,
      ''
    );
    
    // Clean up any double spaces or repetitive quantum terms
    const finalResponse = withoutAgents
      .replace(/\s+/g, ' ')
      .replace(/(quantum)\s+\1/gi, 'quantum')
      .trim();
  
    // Only add identity context if it's a new conversation
    if (!context.includes('quantum')) {
      return `As Quantum-Forge, ${finalResponse}`;
    }
  
    return finalResponse;
  }
  
  