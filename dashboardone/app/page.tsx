'use client'; // Isso diz ao Next.js que este componente vai rodar no navegador do usuário

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Assim que a tela carregar, o React vai no seu backend buscar os dados
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch('/api/metrics');
        const json = await response.json();
        setMetrics(json.data || []);
      } catch (error) {
        console.error('Erro ao buscar métricas:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-light tracking-wider text-white uppercase">
            Visão Geral
          </h1>
          <p className="text-zinc-500 mt-2 text-sm tracking-wide">
            Performance de conteúdo e métricas de alcance.
          </p>
        </header>

        {loading ? (
          <div className="text-center text-zinc-600 animate-pulse">Carregando métricas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Iterando sobre os dados que vieram do seu banco */}
            {metrics.map((item) => (
              <div 
                key={item.id} 
                className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-sm shadow-2xl backdrop-blur-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
                    {item.platform}
                  </h2>
                  <span className="text-xs text-zinc-600">
                    {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-zinc-500">Visualizações</p>
                    <p className="text-2xl font-light text-white">
                      {item.views.toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-xs text-zinc-500">Likes</p>
                      <p className="text-lg font-light text-zinc-300">
                        {item.likes.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Comentários</p>
                      <p className="text-lg font-light text-zinc-300">
                        {item.comments.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}