import { format, parseISO } from 'date-fns';
import { GetStaticProps } from 'next';
import Image from 'next/image'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';

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
  latestEpisodes: Episode[];
  allEpisodes: Episode[],
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos episodeos</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return(
              <li key={episode.id}>
                <Image 
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetail}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.published_at}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="tocar ep"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        
      </section>
    </div>
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

  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.lenght)

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    // somente executado quando estiver em producao
    // revalidade: 60 * 60 * 8,
  };
}