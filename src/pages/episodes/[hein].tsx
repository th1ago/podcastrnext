import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss'

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

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({episode}: EpisodeProps) {
    return (
        <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
            <Link href="/">
                <button type="button">
                    <img src="/arrow-left.svg" alt="Voltar" />
                </button>
            </Link>
            
            <Image 
                width={700} 
                height={160} 
                src={episode.thumbnail} 
                objectFit="cover"
            />
            <button type="button">
                <img src="/play.svg" alt="tocar ep" />
            </button>
        </div>

        <header>
            <h1>{episode.title}</h1>
            <span>{episode.members}</span>
            <span>{episode.published_at}</span>
            <span>{episode.durationAsString}</span>
        </header>

        <div className={styles.description} 
            dangerouslySetInnerHTML={{__html: episode.description}}
        />
    </div>
    )
}

// esse metodo e' exportado em rota que utiliza geracao statica
// e que possua param dinamitos [hein].tsx
export const getStaticPaths: GetStaticPaths = async () => {
    const {data} = await api.get('episodes', {
        params: {
            _limit: 2,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
                hein: episode.id
            }
        }
    })
    
    return {
        paths: [],
        fallback: 'blocking'
    }
}

// so vai criar a pag Static no momento da build/prod
export const getStaticProps: GetStaticProps = async (ctx) => {
    const {hein} = ctx.params;
    const {data} = await api.get(`/episodes/${hein}`)

    const episode = {
        id: data.id,
        title: data.title,
        members: data.members,
        published_at: format(parseISO(data.published_at), 'd MMM yy', {locale: pt }),
        thumbnail: data.thumbnail,
        url: data.file.url,
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        duration: Number(data.file.duration),
        description: data.description,
        utl: data.file.url,
    }

    return {
        props: {
            episode,
        },
        revalidate: 61 * 61 * 24
    }
}