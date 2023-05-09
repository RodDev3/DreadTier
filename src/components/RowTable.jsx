export default function (props) {

    /**
     *
     * @param {*} num
     * @returns String
     */
    function padTo2Digits(num) {
        return num.toString().padStart(2, "0");
    }

    /**
     * Fonction prennant le temps en miliseconde et renvoie le temps sous format heure minute seconde
     * @param {*} totalSeconds
     * @returns String
     */
    function getPrettyTime(totalSeconds) {
        //Récupération de toutes les valeurs qui nous intéresse
        const secondes = Math.floor(totalSeconds % 60);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);

        let prettyTime;

        //On met au bon format
        if (totalSeconds >= 3600) {
            return (prettyTime = hours + "h " + padTo2Digits(minutes) + "m " + padTo2Digits(secondes) + "s");
        } else {
            return (prettyTime = padTo2Digits(minutes) + "m " + padTo2Digits(secondes) + "s");
        }
    }



    //Return chaque ligne du classement
    return (
        <tr>
            <td className="">
                {props.run.position}
            </td>
            <td className="player">
                {/* Cas où le user à été supprimer */}
                {props.run.players.data[0].rel !== "user" ?
                    props.run.players.data[0].name
                    :
                    props.run.players.data[0].names.international
                }
            </td>
            <td className="time">{getPrettyTime(props.run.times.primary_t)}</td>
            <td className="link">
                {/* Cas où la props.run ne possède pas de vidéo */}
                {props.run.videos !== null &&
                    Object.entries(props.run.videos)[0].includes('links') &&
                    <a href={props.run.videos.links[0].uri}>
                        {/* Changement d'icon en fonction de l'url */}
                        {props.run.videos.links['0'].uri.includes("youtu") ?
                            <i className="fa-brands fa-youtube"></i>
                            : props.run.videos.links['0'].uri.includes("twitch") ?
                                < i className="fa-brands fa-twitch"></i>
                                : props.run.videos.links['0'].uri.includes("imgur") ?
                                    <i className="fa-regular fa-image"></i>
                                    : <i className="fa-solid fa-video"></i>
                        }
                    </a>

                }
            </td>
        </tr >

    );
}