import Cookies from "js-cookie";
import { useFilter } from "../contexts/FilterContext";
import { useDebugValue, useEffect, useState } from "react";

export default function () {

    const [filters, setFilters] = useFilter();
    const [isSaved, setIsSaved] = useState(Cookies.get('lbSaved') === JSON.stringify(filters));

    //function qui save le leaderboard dans un cookie
    function Save() {
        Cookies.set("lbSave", JSON.stringify(filters))
        console.log(Cookies.get('lbSave'));
        setIsSaved(true);
    }

    useEffect(() => {
        setIsSaved(Cookies.get('lbSaved') === JSON.stringify(filters));
    }, [filters])

    return (
        Cookies.get('lbSave') === JSON.stringify(filters) ?
            <button onClick={Save} disabled id="save">Sauvegarder le classement</button>
            :
            <button onClick={Save} id="save" className="buttonNotSelected">Sauvegarder le classement</button>

    )
}