import { createContext } from 'react';
const ViewBoxContext = createContext({
    xPos: 0,
    setXPos: () => null,
    yPos: 0,
    setYPos: () => null,
    scale: 1,
    setScale: () => null,
    scaleDelta: 0,
    setScaleDelta: () => null,
    miniMapX: 0,
    setMiniMapX: () => null,
    miniMapY: 0,
    setMiniMapY: () => null,
});
const { Provider } = ViewBoxContext;
export function ViewBoxProvider({ children, value}) {
    return <Provider value={value}>{children}</Provider>
}
export const ViewBoxConsumer = ViewBoxContext.Consumer;
export default ViewBoxContext;
