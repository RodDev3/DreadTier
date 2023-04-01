import React from "react";
import { useEffect, useState } from "react";
import useUpdateEffect from "./CustomHooks";
import { useFilter } from "../contexts/FilterContext";



export default function () {

    const [categories, setCategories] = useState(undefined)

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
        return (
            <div>
                <div className="responsiveCate">
                    <span className="cateSelect">
                        Catégories <i className="fa-solid fa-caret-down rotate"></i>
                    </span>
                    <div className="listCate">
                        {categories.data.map((data, index) => {
                            //console.log(data.id)
                            if (data.id != filters.categoryId) {
                                return <button value={data.id} key={index} onClick={handleClick}>{data.name}</button>
                            } else {
                                return <button value={data.id} key={index} onClick={handleClick} disabled="disabled">{data.name}</button>

                            }
                        })}
                    </div>
                </div>
                <div className="category">
                    {categories.data.map((data, index) => {
                        //console.log(data.id)
                        if (data.id != filters.categoryId) {
                            return <button value={data.id} key={index} onClick={handleClick}>{data.name}</button>
                        } else {
                            return <button value={data.id} key={index} onClick={handleClick} disabled="disabled">{data.name}</button>

                        }
                    })}
                </div>
            </div>
        );
    }
}