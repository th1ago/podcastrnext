import { format, parseISO } from 'date-fns';
import { GetStaticProps } from 'next';
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

type Episode = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  url: string,
  durationAsString: number,
  duration: number
}

type HomeProps = {
  episodes: Episode[];
}

export default function Home(props: HomeProps) {
  return (
      <h1>Index</h1>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  // episodes?_limit=12&_sort=published_at&_order=desc
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  // formatar os dados logo depois da chamado do API
  const episodes = data.map(episode => {
    return{
      id: episode.id,
      title: episode.title,
      members: episode.members,
      published_at: format(parseISO(episode.published_at), 'd MM yy', {locale: ptBR }),
      thumbnail: episode.thumbnail,
      description: episode.description,
      url: episode.file.url,
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      duration: Number(episode.file.duration),
    };
  })

  return {
    props: {
      episodes: data,
    },
    revalidade: 60 * 60 * 8,
  };
}