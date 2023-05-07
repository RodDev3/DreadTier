import { createContext, useContext, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const DeviceContext = createContext();

export function useDevice() {
    return useContext(DeviceContext);
}

export default function DeviceProvider({ children }) {
    const [device, setDevice] = useState();

    const isDesktop = useMediaQuery({ minWidth: 1024 })
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 })
    const isMobile = useMediaQuery({ minWidth: 320, maxWidth: 767 })

    useEffect(() => {
        if (isDesktop) {
            setDevice({ device: "isDesktop" })
        } else if (isTablet) {
            setDevice({ device: "isTablet" })
        } else if (isMobile) {
            setDevice({ device: "isMobile" })
        }
    }, [isDesktop, isTablet, isMobile])

    return (
        <DeviceContext.Provider value={device}>
            {children}
        </DeviceContext.Provider>
    )
}