import React, { useContext } from 'react';
import { useEffect, useState, useRef } from 'react';
import useUpdateEffect from './CustomHooks';
import Leaderboard from './Leaderboard';
import { useOptions } from './OptionsContext';
import '../styles/Leaderboard.css'
//!! OBSOLETE A DELETE
export default function () {

    const [dataApi, setDataApi] = useState();

    const [options, setOptions] = useOptions();
    
    useEffect( () => {
    }, [])
    useUpdateEffect(() =>{

        console.log(options.difficulty)
    },[options])

    function callAnyPercentLeaderboard() {
        fetch("https://www.speedrun.com/api/v1/leaderboards/mdread/category/9kv83mjd?timing=realtime")
            .then((response) => response.json())
            .then((data) => console.log(data))
    }

    async function updateSrcDataWithUsernames() {
        var dataModified = null;

        var response = await fetch("https://www.speedrun.com/api/v1/leaderboards/3dxkz0v1/category/9kv83mjd?timing=realtime&var-wle962k8=zqog43p1&var-ylp6w5rn=" + options.difficulty + "&var-68k5y4y8=" + options.turbo);
        dataModified = await response.json();

        console.log(dataModified);

        for (var i = 0; i < 5/*dataModified["data"]["runs"].length*/; i++) {

            response = await fetch("https://www.speedrun.com/api/v1/users/" + dataModified["data"]["runs"][i]["run"]["players"][0]["id"]);
            const usernames = await response.json();

            console.log(usernames)
            dataModified["data"]["runs"][i]["run"]["players"][0]["id"] = await usernames["data"]["names"]["international"];


            //console.log(dataModified["data"]["runs"][i]["run"]["players"][0]["id"]);
        }
        //console.log(dataModified)
        setDataApi({ dataModified });

    }

    //Good
    function callUrRookieRuns() {
        // 1er call api afin d'avoir les runs du leaderboard
        fetch("https://www.speedrun.com/api/v1/leaderboards/3dxkz0v1/category/9kv83mjd?timing=realtime&var-wle962k8=zqog43p1&var-ylp6w5rn=jq66533q")
            .then((response) => response.json())
            .then((data) => setDataApi(data.data.runs));
    }

    //Good
    function getUsernamesFromId() {

        const promiseArray = [];

        for (var i = 0; i < dataApi.length; i++) {
            promiseArray.push(
                fetch("https://www.speedrun.com/api/v1/users/" + dataApi[i]['run']['players'][0]['id'])
                    .then(response => response.json())
                    .then((data) => { return data.data.names.international })
            );
        }

        Promise.all(promiseArray).then(values => {
            setUserApi(...userApi, values)
        });

    }


    useEffect(() => {
        updateSrcDataWithUsernames();
    }, [options])

    if (dataApi === undefined) {
        return <h1>loading</h1>
    }
    
    function padTo2Digits(num){
        return num.toString().padStart(2, '0');
    }

    function getPrettyTime(totalSeconds){
        const secondes = Math.floor(totalSeconds % 60)
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        
        let prettyTime;

        if(totalSeconds >= 3600){
            return prettyTime = hours + 'h ' + padTo2Digits(minutes) + "m " +  padTo2Digits(secondes) +"s";
        } else {
            return prettyTime = padTo2Digits(minutes) + "m " +  padTo2Digits(secondes) +"s";
        }
    }
    




    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Player</th>
                    <th>RTA</th>
                </tr>
            </thead>
            <tbody>
                {dataApi["dataModified"]["data"]["runs"].map((data, index) => {
                    //console.log(data.place);
                    return (
                        <tr key={data.run.players[0].id} id={data.place}>
                            <td className='rank'>{data.place}</td>
                            <td className='player'>{data.run.players[0].id}</td>
                            <td className='time'>{getPrettyTime(data.run.times.primary_t)}</td>
                        </tr>

                    );
                })}
            </tbody>
        </table>
    );
}
//!!!! Pour la difficulté c'est la ligne values "ylp6w5rn", pour le turbo c'est '68k5y4y8' et le support 'wl39pqyl', nmg/any% "wle962k8"
//wle962k8=zqog43p1 => UR

//TODO Classer par leaderboard de l'api et ensuite on pourrra faire les tags
// on peut faire un button qui chang le call de l'api en changeant de caté

///!!!!! api limite les call à 210 par minute