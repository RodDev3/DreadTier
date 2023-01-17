import { useState, useEffect } from "react";
import { useFilter } from "../contexts/FilterContext";
import useUpdateEffect from "./CustomHooks";

export default function () {

    const [runs, setRuns] = useState([]);
    const [runsFiltered, setRunsFiltered] = useState([]);

    const [filters, setFilters] = useFilter();
    var offset = 0;
   
    function byTime(a,b){
        return parseInt(a.times.primary_t) - parseInt(b.times.primary_t);
    }


    function getPage(offset){
        return fetch("https://www.speedrun.com/api/v1/runs?game=3dxkz0v1&status=verified&category="+filters.categoryId+"&max=200&embed=players&offset="+offset)
        .then(response => response.json())
        .then(data => {
            console.log("Offset dans getpage = " + offset)
            return {data, offset}
        })
        .catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
        }
    
    
    function getAllRunsPromise(){
        return getPage(offset).then(page =>{
            if(page.data.data.length == 0){
                //Il n'y a plus de data dans le call api
                return page.data.data;
            }else{
                //Sinon on continue les calls
                offset += 200
                return getAllRunsPromise().then(nextPageData => {
                    //console.log('page.data.data : ' + JSON.stringify(page.data.data))
                    return page.data.data.concat(nextPageData)
                })
            }
        })
        .catch(error => {
            console.error(error)
            return Promise.reject(error)
        })
    }

    function promiseAllRuns(){

        const start = new Date();
        
        Promise.all([getAllRunsPromise()])
        .then(allData => {
            console.log(allData)
            
            //Trie du tableau, on le .flat() avant
            allData = allData.flat();
            allData.sort(byTime);
            
            setRuns(allData)
            const end = new Date();
            
            const diffTime = Math.abs(end - start);
            console.log('Avec promise.all : ' + diffTime + 'ms')
        })
        .catch(error => {
            console.error(error)
        })
    }

    // Test avec async/await mais meilleur perf avec promise.all
    /*async function callAllRuns() {
        const start = new Date();

        var results = [];
        
        var url = "https://www.speedrun.com/api/v1/runs?game=3dxkz0v1&status=verified&category="+filters.categoryId+"&max=200&embed=players"
        
        while (url) {
            var response = await fetch(url);
            
            var data = await response.json();
            console.log(data)
            var nextUrl = await data.pagination.links
            
            if (nextUrl.length > 1) {
                url = await nextUrl[1].uri
            }else if (nextUrl == 0){
                url = undefined;
            } else if (nextUrl[0].rel === "next") {
                url = await nextUrl[0].uri
            }else{
                url = undefined;
            }

            results.push(...data.data);
        }
        console.log(results[0])
        results.sort(byTime);
        console.log(results)
        setRuns(results);

        const end = new Date();

        const diffTime = Math.abs(end - start);
        console.log('traitement : ' + diffTime + 'ms')
        console.log(results)
    }*/
   
    function filterRuns(){

        const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];

        var result = words.filter(word => word.length > 6);

        result = result.push(words.filter(word => word.length > 8));
        console.log(result);

        const tab = new Set();
        // TODO Gerer le fait qu'en boss rush il n'y a pas de subctahégory donc pas de filtrage à faire

        var runsWithFilters = runs.filter(run => run.values[filters.subCategory.key] == [filters.subCategory.value])
        .filter(run => run.values[filters.difficulty.key] == [filters.difficulty.value])
        .filter(run => run.values[filters.copy.key] == [filters.copy.value])
        .filter(run => run.values[filters.turbo.key] == [filters.turbo.value])
        .filter(element => {
            
            const isDuplicate = tab.has(element.players.data[0].id)
            tab.add(element.players.data[0].id)

            if(!isDuplicate){
                return true
            }
            return false
        })

        console.log(runsWithFilters)
        
        setRunsFiltered(runsWithFilters)
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
    
    // Lancement des calls api lors du premier render
    useEffect(() => {
        //callAllRuns()
        promiseAllRuns();
    }, [filters.categoryId])
    
    // Filtre des runs lorsque runs est défini ou les filtres sont modifiés
    useEffect(() => {
        console.log(runs)
        filterRuns()
    }, [filters, runs])

    useUpdateEffect(() => {
        //TODO Faire le tableau de comparaison
        console.log(runsFiltered)
    }, [runsFiltered])
    /*useUpdateEffect(() => {
        runFiltered = filterRuns();
    }, [filters])*/// TODO mettre les filtres en dependances

    if(!(runsFiltered == undefined)){
        if( runsFiltered.length != 0){
        return (
            <table>
                <thead>
                    <tr>
                        <th>Classement</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {runsFiltered.map((run) => {
                        //TODO Mettre les liens des videos (si il y en a) et mettre icon youtube ou twitch avec code couleur en hover
                        return <tr key={run.id}>
                                    <td>{run.players.data[0].names.international}</td>
                                    <td>{getPrettyTime(run.times.primary_t)}</td>
                                    <td><i class="fa-brands fa-youtube"></i></td>
                                </tr>
                    })}
                </tbody>
            </table>
        );
    }else{
        return (
            <div>
                Aucune runs
            </div>
        );
    }
    }
}

