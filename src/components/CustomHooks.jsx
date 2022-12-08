import { useEffect, useRef } from "react";

export default function useUpdateEffect(callback, dependencies)
{
    const didMount = useRef(false);

    useEffect(() => {
        if(didMount.current){
            return callback();
        } else {
            didMount.current = true;
        }
    }, dependencies);
}