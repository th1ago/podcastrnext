import Image from 'next/image';
import { useContext, useRef, useEffect } from 'react';
import { PlayerContext } from '../../contexts/PlayerConstext';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import styles from './styles.module.scss';

export default function Player() {
    const aufioRef = useRef<HTMLAudioElement>(null)
    
    const {
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        tooglePlay} = useContext(PlayerContext)

    useEffect(() => {
        if(!aufioRef.current) {
            return;
        }

        if(isPlaying) {
            aufioRef.current.play()
        } else {
            aufioRef.current.pause()
        }

    }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                        width={592} 
                        height={592} 
                        src={episode.thumbnail} 
                        objectFit="cover" 
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione algo para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty: ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{ background: 'green'}}
                                railStyle={{ background: '#9f75ff'}}
                                handleStyle={{ borderColor: 'green', borderWidth: 4}}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                        
                    </div>
                    <span>00:00</span>
                </div>
                
                { episode && (
                    <audio 
                        src={episode.url}
                        ref={aufioRef}
                        autoPlay
                    />
                )}

                <div className={styles.button}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button 
                        type="button" 
                        className={styles.playButton} 
                        disabled={!episode}
                        onClick={tooglePlay}
                        >
                        { isPlaying
                            ? <img src="/pause.svg" alt="Tocar"/>
                            : <img src="/play.svg" alt="Tocar"/>
                        }
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-next.svg" />
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" />
                    </button>
                </div>
            </footer>
        </div>
    );
}