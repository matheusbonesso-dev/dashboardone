import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getYouTubeMetrics } from '@/lib/services/youtube';

// Usamos POST porque esta rota realiza uma alteração de estado (grava no banco)
export async function POST() {
  try {
    // Substitua pelo ID do canal que você quer monitorar.
    // Você acha o ID na URL do canal, ex: youtube.com/channel/UC...
    const myChannelId = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // Exemplo (Google Developers)

    // 1. Busca os dados no serviço externo
    const ytData = await getYouTubeMetrics(myChannelId);

    // 2. Persiste os dados no Supabase
    const { error } = await supabase
      .from('social_metrics')
      .insert([
        {
          platform: ytData.platform,
          views: ytData.views,
          likes: ytData.likes,
          comments: ytData.comments
        }
      ]);

    if (error) {
      console.error('Erro de inserção no Supabase:', error);
      return NextResponse.json({ error: 'Falha ao salvar no banco.' }, { status: 500 });
    }

    // 3. Retorna sucesso
    return NextResponse.json({ 
      message: 'Sincronização concluída com sucesso!',
      insertedData: ytData 
    }, { status: 201 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Erro no Sync Route:', err);
    return NextResponse.json({ error: err.message || 'Erro interno.' }, { status: 500 });
  }
}