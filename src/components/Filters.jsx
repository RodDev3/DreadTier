import React from "react";
import { useEffect, useState } from "react";
import { useFilter } from '../contexts/FilterContext';
import useUpdateEffect from "./CustomHooks";
import SubCategory from "./SubCategory";

export default function () {

    const [filters, setFilters] = useFilter();

    const [valueButtons, setValueButtons] = useState();


    async function getSubCategoryFromCategory() {
        var url = 'https://www.speedrun.com/api/v1/categories/' + filters.categoryId + '/variables';
        var response = await fetch(url);
        var results = await response.json();
        
        console.log(results.data);

        var subCategory = undefined;
        var difficulty = undefined;
        var turbo = undefined;
        var copy = undefined;

        //Foreach permettant de mettre a jour les key des differents params de runs
        results.data.forEach((row) => {
            //console.log(row)
            switch (row.name) {

                case "Glitch Category":
                    subCategory = row.id;
                    break;

                case "Category":
                    subCategory = row.id;
                    break;

                case "Difficulty":
                    difficulty = row.id;
                    break;

                case "Turbo":
                    turbo = row.id;
                    break;

                case "Copy":
                    copy = row.id;
                    break;

                default: break;
            }
            //TODO value par default
            setFilters({
                ...filters,
                subCategory: {
                    ...filters.subCategory,
                    key: subCategory
                },
                difficulty: {
                    ...filters.difficulty,
                    key: difficulty
                },
                turbo: {
                    ...filters.turbo,
                    key: turbo
                },
                copy: {
                    ...filters.copy,
                    key: copy
                }
            })

        })
        setValueButtons(results.data);


    }

    function handleClickTurbo(e) {
        console.log(e.target.value)
        setFilters({
            ...filters,
            turbo: {
                ...filters.turbo,
                value: e.target.value,
                label: e.target.innerText
            }
        });
    }

    function handleClickDifficulty(e) {
        console.log(e.target.value)
        setFilters({
            ...filters,
            difficulty: {
                ...filters.difficulty,
                value: e.target.value,
                label: e.target.innerText
            }
        });
    }

    function handleClickCopy(e) {
        console.log(e.target.value)
        setFilters({
            ...filters,
            copy: {
                ...filters.copy,
                value: e.target.value,
                label: e.target.innerText
            }
        });
    }

    function handleClickSubCategory(e) {
        console.log(e.target.value)
        setFilters({
            ...filters,
            subCategory: {
                ...filters.subCategory,
                value: e.target.value,
                label: e.target.innerText
            }
        });
    }

    //TODO Voir si besoin d'un useUpdateEffect
    useEffect(() => {
        getSubCategoryFromCategory();
    }, [filters.categoryId])

    useEffect(() => {
        console.log(filters)
    }, [filters])
    useUpdateEffect(() => {

    }, [valueButtons]);
    
    if (valueButtons == undefined) {
        return (<div> Charegement qdsdqd</div>);
    } else {
        return (
            <div id="buttonsWrapper">
                <div>
                    {
                        valueButtons.map((row) => {
                            if (row.name === "Glitch Category" || row.name === "Category") {
                                return <SubCategory key={row.id} row={row} function={handleClickSubCategory}/>
                            }
                        })
                    }
                </div>
                <div>
                    {
                        valueButtons.map((row) => {
                            if (row.name === "Difficulty") {
                                return <SubCategory key={row.id} row={row} function={handleClickDifficulty} />
                            }
                        })
                    }
                </div>
                <div>
                    {
                        valueButtons.map((row) => {
                            if (row.name === "Turbo") {
                                return <SubCategory key={row.id} row={row} function={handleClickTurbo} />
                            }
                        })
                    }

                </div>
                <div>
                    {
                        valueButtons.map((row) => {
                            if (row.name === "Copy") {
                                return <SubCategory key={row.id} row={row} function={handleClickCopy} />
                            }
                        })
                    }
                </div>
            </div>

        );
    }
}