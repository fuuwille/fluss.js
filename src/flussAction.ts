import FlussState from "./flussState";

type FlussAction = <TState extends FlussState>(state : TState) => void | Promise<void>;

export default FlussAction;