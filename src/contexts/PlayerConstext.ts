import {createContext} from 'react';

type Episode = {
    title: string,
    members: string,
    thumbnail: string,
    duration:number,
    url: string
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    play: (episode: Episode) => void;
}

// uma forma de passar dados entre os componentes sem utilizar o props
export const PlayerContext = createContext({} as PlayerContextData);