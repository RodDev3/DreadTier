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
            label : 'Unrestricted',
            key : 'wle962k8',
            value : 'zqog43p1',
        },
        difficulty : {
            label : 'Rookie',
            key : 'ylp6w5rn',
            value : 'jq66533q',
        },
        turbo : {
            label: 'Yes',
            key: '68k5y4y8',
            value: 'xqkw2nnq',
        },
        copy: {
            label : 'Digital',
            key : 'wl39pqyl',
            value : 'klrd9vmq',
        }
    });

    return (
        <FilterContext.Provider value={[filters, setFilters]}>
            {children}
        </FilterContext.Provider>
    )
}