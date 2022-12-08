import { createContext, useState, useContext } from "react";

const FilterContext = createContext();

export function useFilter (){
    return useContext(FilterContext);
}

export default function FilterProvider({children})
{

    //TODO remplacer les valeurs par les valeurs enregistree dans les cookies
    //TODO
    const [filters, setFilters] = useState({
        categoryId : '9kv83mjd',
        subCategory : {
            label : '',
            key : '',
            value : '',
        },
        difficulty : {
            label : '',
            key : '',
            value : 'jq66533q',
        },
        turbo : {
            label: '',
            key: '',
            value: 'xqkw2nnq',
        },
        copy: {
            label : '',
            key : '',
            value : '',
        }
    });

    return (
        <FilterContext.Provider value={[filters, setFilters]}>
            {children}
        </FilterContext.Provider>
    )
}