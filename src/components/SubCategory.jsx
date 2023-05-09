import { useDevice } from "../contexts/DeviceContext";
import { useFilter } from "../contexts/FilterContext";
//import '../assets/js/clickButton';

export default function (props) {

    const [filters, setFilters] = useFilter();
    const device = useDevice();

    //Affichage des sous catégories et disable les options présentes dans le context
    return (

        Object.entries(props.row.values.values).map((key) => {
            switch (key[0]) {
                case filters.copy.value:
                case filters.difficulty.value:
                case filters.turbo.value:
                case filters.subCategory.value:

                    //Vérification du device avant de return
                    switch (device.device) {
                        case "isDesktop":
                            return <button key={key[0]} onClick={props.function} value={key[0]} className="buttonSelected" >{key[1].label}</button>
                        case "isTablet":
                        case "isMobile":
                            return <option key={key[0]} value={key[0]}>{key[1].label}</option>
                    }

                default:
                    switch (device.device) {
                        case "isDesktop":
                            return <button key={key[0]} onClick={props.function} value={key[0]} className="buttonNotSelected">{key[1].label}</button>
                        case "isTablet":
                        case "isMobile":
                            return <option key={key[0]} value={key[0]}>{key[1].label}</option>
                    }
            }
        })

    );

}