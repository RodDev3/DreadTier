import React from "react";
import { useEffect, useState } from "react";
import useUpdateEffect from "./CustomHooks";
import { useFilter } from "../contexts/FilterContext";
import { useDevice } from "../contexts/DeviceContext";



export default function () {

    const [categories, setCategories] = useState(undefined)
    const device = useDevice();
    const [filters, setFilters] = useFilter();

    async function getAllCategory() {

        const url = "https://www.speedrun.com/api/v1/games/3dxkz0v1/categories";
        var response = await fetch(url);
        setCategories(await response.json());
    }

    //Function d'update du context en f() de la categorie selectionee
    function handleClick(e) {
        //console.log(e.target.value);
        setFilters({ ...filters, categoryId: e.target.value })
    }

    //Call de l'api au premier render
    useEffect(() => {
        getAllCategory()
    }, [])


    if (categories !== undefined) {
        if (device.device === "isMobile") {
            //Affichage Mobile
            return (
                <div>
                    <select name="Cate" value={filters.categoryId} onChange={handleClick}>
                        {categories.data.map((data, index) => {
                            if (data.id !== filters.categoriesId) {
                                return <option key={index} value={data.id}>{data.name}</option>
                            } else {
                                return <option key={index}>{data.name}</option>
                            }
                        })}
                    </select>
                </div>
            );
        } else {
            //Affichage Bureau
            return (
                <div className="category">
                    {categories.data.map((data, index) => {
                        //console.log(data.id)
                        if (data.id != filters.categoryId) {
                            return <button value={data.id} key={index} onClick={handleClick} className="buttonNotSelected">{data.name}</button>
                        } else {
                            return <button value={data.id} key={index} onClick={handleClick} className="buttonSelected">{data.name}</button>

                        }
                    })}
                </div>
            );
        }
    }
}