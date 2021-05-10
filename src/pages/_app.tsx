import Header from '../components/Header'
import Player from '../components/Player'

import '../styles/global.scss'
import styles from '../styles/app.module.scss';
import { PlayerContextProvider } from '../contexts/PlayerConstext';

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
    <link rel="shortcut icon" href="#" />
    <div className={styles.wrapper}>
      <main>
        <Header />
        <Component {...pageProps} />  
      </main>
      <Player />
    </div>
    </PlayerContextProvider>
  )
}

export default MyApp
