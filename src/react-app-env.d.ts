/// <reference types="react-scripts" />


declare module '*.mp3' {
    const src: string;
    export default src;
}

declare module 'react-combine-reducers'{

    function combineReducers (arg:any):any;

}