export async function getYouTubeMetrics(channelId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY não configurada no .env.local');
  }

  // Endpoint para buscar estatísticas gerais do CANAL (Total de views, inscritos e vídeos)
  const url = `https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro na API do YouTube: ${response.statusText}`);
  }

  const data = await response.json();
  const stats = data.items?.[0]?.statistics;

  if (!stats) {
    throw new Error('Canal não encontrado ou sem dados públicos.');
  }

  // Normalizando o dado para o formato do nosso banco de dados
  return {
    platform: 'youtube',
    views: parseInt(stats.viewCount || '0', 10),
    // A API de canal não devolve o total de likes/comments de todos os vídeos de forma agregada.
    // Para isso, precisaríamos iterar vídeo a vídeo (custoso). Por enquanto, salvamos 0.
    likes: 0, 
    comments: 0,
  };
}