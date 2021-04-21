import format from 'date-fns/format';
import pt from 'date-fns/locale/pt-BR';


import styles from './styles.module.scss';

export default function Header() {
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: pt,
    });

    return (
        <header className={styles.headerContainer}>
            <img src="/logo.svg"></img>
            
            <p>o Melhor para voce ouvir, sempre</p>

            <span>{currentDate}</span>
        </header>
    );
}