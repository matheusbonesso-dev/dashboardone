import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Faz a consulta ao banco de dados ordenando pelas métricas mais recentes
    const { data, error } = await supabase
      .from('social_metrics')
      .select('*')
      .order('created_at', { ascending: false });

    // Tratamento de erro padrão de backend
    if (error) {
      console.error('Erro no Supabase:', error);
      return NextResponse.json({ error: 'Falha ao buscar dados do banco.' }, { status: 500 });
    }

    // Retorna o JSON limpo para quem chamou (o front-end)
    return NextResponse.json({ data }, { status: 200 });

  } catch (err) {
    console.error('Erro interno:', err);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}