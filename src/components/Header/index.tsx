import styles from './styles.module.scss';

export default function Header() {
    return (
        <header className={styles.headerContainer}>
            <img src="/logo.svg"></img>
            
            <p>o Melhor para voce ouvir, sempre</p>

            <span>Qui, 8 de Abril</span>
        </header>
    );
}