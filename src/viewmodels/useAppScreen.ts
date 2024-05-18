import { useEffect } from "react";
import game from "../game/game";
import useDestroy, { Action } from "../hooks/useDestroy";

export const useApScreens = () => {
    useEffect(() => {
        const destroyers: Action[] = [];

        (async () => {
            const { destroyer } = await game();
            destroyers.push(destroyer);
        })();

        return useDestroy(destroyers);
    });

    return {};
};
