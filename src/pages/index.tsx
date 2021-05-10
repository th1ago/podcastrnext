import { format, parseISO } from 'date-fns';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import pt from 'date-fns/locale/pt-BR'
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';
import { usePlayer } from '../contexts/PlayerConstext';

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
  const {playList} = usePlayer()

  const episodeList = [...latestEpisodes, ...allEpisodes];
  
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos episodeos</h2>
        <ul>
          {latestEpisodes.map((episode, index) => {
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
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.published_at}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="tocar ep"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episodios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
            <th></th>
            <th>Podcast</th>
            <th>Integrantes</th>
            <th>Data</th>
            <th>Duracao</th>
            <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return(
                <tr key={episode.id}>
                <td style={{width: 72 }}>
                  <Image 
                    width={120} 
                    height={120} 
                    src={episode.thumbnail} 
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>
                <td>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                </td>
                <td>{episode.members}</td>
                <td style={{width: 100 }}>{episode.published_at}</td>
                <td>{episode.durationAsString}</td>
                <td>
                  <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                    <img src="/play-green.svg" alt="Trocar ep" />
                  </button>
                </td>
                </tr>
              )
            })}
          </tbody>
        </table>
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
      published_at: format(parseISO(episode.published_at), 'd MMM yy', {locale: pt }),
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