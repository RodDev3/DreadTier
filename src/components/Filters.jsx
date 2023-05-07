import React from "react";
import { useEffect, useState } from "react";
import { useFilter } from '../contexts/FilterContext';
import useUpdateEffect from "./CustomHooks";
import SubCategory from "./SubCategory";
import { useDevice } from "../contexts/DeviceContext";

export default function () {

    const [filters, setFilters] = useFilter();
    const device = useDevice();
    const [valueButtons, setValueButtons] = useState();


    async function getSubCategoryFromCategory() {
        var url = 'https://www.speedrun.com/api/v1/categories/' + filters.categoryId + '/variables';
        var response = await fetch(url);
        var results = await response.json();

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
                    label: subCategory[1],
                    key: subCategory[0],
                    value: subCategory[2]
                },
                difficulty: {
                    label: difficulty[1],
                    key: difficulty[0],
                    value: difficulty[2]
                },
                turbo: {
                    label: turbo[1],
                    key: turbo[0],
                    value: turbo[2]
                },
                copy: {
                    label: copy[1],
                    key: copy[0],
                    value: copy[2]
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


    useEffect(() => {
        getSubCategoryFromCategory();
    }, [filters.categoryId])

    //TODO Pour l'affichage Mobile voir pour récup les data des selects
    if (valueButtons !== undefined) {
        if (device.device === "isMobile") {
            return (
                <div>
                    <select name="" id="">
                        {valueButtons.map((row) => {
                            if (row.name === "Glitch Category" || row.name === "Category") {
                                return <SubCategory key={row.id} row={row} function={handleClickSubCategory} />
                            }
                        })}
                    </select>
                    <select name="" id="">
                        {valueButtons.map((row) => {
                            if (row.name === "Difficulty") {
                                return <SubCategory key={row.id} row={row} function={handleClickSubCategory} />
                            }
                        })}
                    </select>
                    <select name="" id="">
                        {valueButtons.map((row) => {
                            if (row.name === "Turbo") {
                                return <SubCategory key={row.id} row={row} function={handleClickSubCategory} />
                            }
                        })}
                    </select>
                    {filters.categoryId !== "9kvrw802" &&
                        <select name="" id="">
                            {valueButtons.map((row) => {
                                if (row.name === "Copy") {
                                    return <SubCategory key={row.id} row={row} function={handleClickSubCategory} />
                                }
                            })}
                        </select>
                    }
                </div>
            );
        }
        //Desktop Display
        return (
            <div id="buttonsWrapper">
                <span>
                    SubCategory :
                </span>
                <div className="subCategories">
                    {
                        valueButtons.map((row) => {
                            if (row.name === "Glitch Category" || row.name === "Category") {
                                return <SubCategory key={row.id} row={row} function={handleClickSubCategory} />
                            }
                        })
                    }
                </div>
                <span>
                    Difficulty :
                </span>
                <div className="subCategories">

                    {
                        valueButtons.map((row) => {
                            if (row.name === "Difficulty") {
                                return <SubCategory key={row.id} row={row} function={handleClickDifficulty} />
                            }
                        })
                    }
                </div>
                <span>
                    Turbo :
                </span>
                <div className="subCategories">

                    {
                        valueButtons.map((row) => {
                            if (row.name === "Turbo") {
                                return <SubCategory key={row.id} row={row} function={handleClickTurbo} />
                            }
                        })
                    }
                </div>
                {/* Gestion du Cas Boss Rush où l'on n'a pas besoin de support */}
                {filters.categoryId !== "9kvrw802" &&
                    <span>
                        Support :
                    </span>
                }
                <div className="subCategories">

                    {
                        filters.categoryId !== "9kvrw802" &&
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