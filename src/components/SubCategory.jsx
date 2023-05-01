import React from "react";
import { useFilter } from "../contexts/FilterContext";

export default function (props) {

    const [filters, setFilters] = useFilter();

    //Affichage des sous catégories et disable les options présentes dans le context
    return (
        <div id="subCategories">
            {
                Object.entries(props.row.values.values).map((key) => {
                    switch (key[0]) {
                        case filters.copy.value:
                        case filters.difficulty.value:
                        case filters.turbo.value:
                        case filters.subCategory.value:
                            return <button key={key[0]} onClick={props.function} value={key[0]} className="getValue" disabled="disabled">{key[1].label}</button>

                        default:
                            return <button key={key[0]} onClick={props.function} value={key[0]} className="getValue">{key[1].label}</button>
                    }
                })
            }
        </div>
    );

}