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

        var subCategory = [];
        var difficulty = [];
        var turbo = [];
        var copy = [];

        //Foreach permettant de mettre a jour les key des differents params de runs
        results.data.forEach((row) => {
            switch (row.name) {

                case "Glitch Category":
                case "Category":
                    //console.log(row.values.values[Object.keys(row.values.values)[0]].label) // Label Sub-Caté [0]
                    //console.log(Object.keys(row.values.values)[0]) //Key Sub-Caté[0]
                    subCategory.push(row.id)
                    subCategory.push(row.values.values[Object.keys(row.values.values)[0]].label)
                    subCategory.push(Object.keys(row.values.values)[0])
                    console.log(subCategory)
                    break;

                case "Difficulty":
                    difficulty.push(row.id)
                    difficulty.push(row.values.values[Object.keys(row.values.values)[0]].label)
                    difficulty.push(Object.keys(row.values.values)[0])
                    //console.log(difficulty)
                    break;

                case "Turbo":
                    turbo.push(row.id);
                    turbo.push(row.values.values[Object.keys(row.values.values)[0]].label);
                    turbo.push(Object.keys(row.values.values)[0])
                    //console.log(turbo)
                    break;

                case "Copy":
                    copy.push(row.id);
                    copy.push(row.values.values[Object.keys(row.values.values)[1]].label);
                    copy.push(Object.keys(row.values.values)[1])
                    //console.log(copy)
                    break;

                default: break;
            }
            //Value par default
            setFilters({
                ...filters,
                subCategory: {
                    label : subCategory[1],
                    key: subCategory[0],
                    value : subCategory[2]
                },
                difficulty: {
                    label : difficulty[1],
                    key: difficulty[0],
                    value : difficulty[2]
                },
                turbo: {
                    label : turbo[1],
                    key: turbo[0],
                    value : turbo[2]
                },
                copy: {
                    label : copy[1],
                    key: copy[0],
                    value : copy[2]
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