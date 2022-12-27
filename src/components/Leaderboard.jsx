import { useState, useEffect } from "react";
import { useFilter } from "../contexts/FilterContext";
import useUpdateEffect from "./CustomHooks";

export default function () {

    const [runs, setRuns] = useState([]);
    const [runsFiltered, setRunsFiltered] = useState([]);

    const [filters, setFilters] = useFilter();
   
    function byTime(a,b){
        return parseInt(a.times.primary_t) - parseInt(b.times.primary_t);
    }
    
    async function callAllRuns() {
       
        var results = [];
        
        var url = "https://www.speedrun.com/api/v1/runs?game=3dxkz0v1&status=verified&category="+filters.categoryId+"&max=200&embed=players"
        
        while (url) {
            var response = await fetch(url);
            
            var data = await response.json();
            
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
        results = results.sort(byTime);
        //console.log(results)
        setRuns(results);
    }
   
    function filterRuns(){

        const words = ['spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];

        var result = words.filter(word => word.length > 6);

        result = result.push(words.filter(word => word.length > 8));
        console.log(result);

        const tab = new Set();
        // TODO Gerer le fait qu'en boss rush il n'y a pas de subctahégory donc pas de filtrage à faire

        var runsWithFilters = runs.filter(run => {
            if(run.values[filters.subCategory.key] == [filters.subCategory.value] /*&& run.values[filters.subCategory.key] == [filters.subCategory.value]*/){
                return true;
            }else{
                return false
            }
        })
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
    
    useEffect(() => {
        callAllRuns()
    }, [filters.categoryId])
    
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
        return (
            <table>
                <thead>
                    <tr>
                        <th>Classement</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {runsFiltered.map((run) => {
                        return <tr key={run.id}>
                                    <td>{run.players.data[0].names.international}</td>
                                    <td>{getPrettyTime(run.times.primary_t)}</td>
                                </tr>
                    })}
                </tbody>
            </table>
        );
    }
}

