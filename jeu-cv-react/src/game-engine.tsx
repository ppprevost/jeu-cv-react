import React, {forwardRef} from 'react';

interface Position {
    y: number,
    x: number,
    src: string,
    borderWidth?: number,
}

const positionDefault =
    {
        y: 548,
        x: 0,
        width: 100,
        height: 100,
        borderWidth: 5,
        src: 'img/field.png'
    }


export const RenderItem = (Component: any) => (position: Position = positionDefault) => (extendsCreation: Function = () => {
}) => (animateFunc: Function = () => {
}) => {
    const myRef: any = React.createRef<HTMLImageElement>().current;
    console.log(myRef)
    myRef.style.top = position.y + "px"
    myRef.style.left = position.x + "px"
    extendsCreation(position, myRef);
    //animation(position, myRef)(animateFunc)
    return <Component
        src={position.src} alt="" />
}

export const createAnimateAndRender = (createFunc: Function) => (animateFunc: Function) => (renderFunc: Function) => (position: Position) => createFunc(animateFunc(renderFunc))(position)