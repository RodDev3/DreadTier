import { useState, useEffect } from "react";
import { useFilter } from "../contexts/FilterContext";
import useUpdateEffect from "./CustomHooks";

export default function () {

    const [dataApi, setDataApi] = useState();

    const [filters, setFilters] = useFilter();
   
    function byTime(a,b){
        return parseInt(a.times.primary_t) - parseInt(b.times.primary_t);
    }
    
    async function callAllRuns() {
        var comparaison = [];
        var results = [];
        
        var url = "https://www.speedrun.com/api/v1/runs?game=3dxkz0v1&status=verified&category=9kv83mjd&max=200"
        
        while (url) {
            var response = await fetch(url);
            
            var data = await response.json();

            var nextUrl = await data.pagination.links

            if (nextUrl.length > 1) {
                url = await nextUrl[1].uri
            } else if (nextUrl[0].rel === "next") {
                url = await nextUrl[0].uri
            }else{
                url = undefined;
            }

            results.push(...data.data);
        }
        results = results.sort(byTime);
        //console.log(results)
        //console.log(results.filter(value => value.values.ylp6w5rn == "jq66533q"))// runs rookie any% all catégories
        
        //setup du tab de comparaison
        /*for (let i = 0; i < results.length; i++){
            if (!comparaison.includes(results[i].players.data[0].names.international)){
                comparaison.push(results[i].players.data[0].names.international)
            }
        }
        console.log(comparaison)*/
    }

    useEffect(() => {
        callAllRuns()
    }, [])

    useUpdateEffect(() => {
    //    console.log(filters)
    }, [filters])

    /*return (
    );*/
}