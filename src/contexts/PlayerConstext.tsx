import {createContext, ReactNode} from 'react';
import { useState } from 'react';

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
    isPlaying: boolean;
    play: (episode: Episode) => void;
    playNext: () => void;
    playPrevious: () => void;
    setPlayingState: (state: boolean) => void;
    playList: (list: Episode[], index: number) => void;
    tooglePlay: () => void;
}

// uma forma de passar dados entre os componentes sem utilizar o props
export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProvider = {
  children: ReactNode;
}

export function PlayerContextProvider({children}: PlayerContextProvider) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function tooglePlay () {
    setIsPlaying(!isPlaying);
  }

  function setPlayingState (state: boolean) {
    setIsPlaying(state)
  }

  function playNext() {
    const nextEpisodeIndex = currentEpisodeIndex + 1;
    
    if (nextEpisodeIndex < episodeList.length) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1)  
    }
  }

  function playPrevious() {
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)  
    }
  }

  return (
    <PlayerContext.Provider value={{ episodeList, 
      currentEpisodeIndex, 
      play,
      playNext,
      playPrevious,
      isPlaying, 
      tooglePlay, 
      setPlayingState,
      playList}}>

        {children}
    </PlayerContext.Provider>
  )
    
}