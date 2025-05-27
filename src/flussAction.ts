type FlussAction = () => void | Promise<void>;

export default FlussAction;

// ------------------------------ // -  - // ------------------------------ //

export type FlussActionBundle = {
    main: FlussAction;
    pre?: FlussAction | null;
    post?: FlussAction | null;
}