import React, {FunctionComponent} from "react";
import {useGameData} from "../store/GameProvider";

export interface IContainerSprite {
    className: string
    zIndex?: number,
    width: number,
    height: number,
    exactSpriteConflict?:{}
    x: number,
    y: number,
    sprite: number,
    src: string,
    behavior?: number
}

const ImgSprite = ({src, sprite = 0, behavior = 0}: any) => {
    return <img src={src} style={{left: sprite + 'px', top: behavior + 'px', position: 'absolute'}} />
}


const BuildContainerForSprite:FunctionComponent<IContainerSprite> = ({zIndex = 20, width, height, x, y, behavior = 0, sprite = 0, className, src, exactSpriteConflict}) => {
    const [{direction}] = useGameData();
    return (
        <div
        className={className}
        style={
            {
                width,
                height,
                position:"absolute",
                overflow:"hidden",
                left:x,
                bottom:y,
                zIndex:zIndex
            }
        }
      >

        <ImgSprite
            src={src}
            alt={className}
            behavior={behavior}
            sprite={sprite}
        />
            <div className={"exactSprite-" + className}
                 style={{position:"absolute", ...exactSpriteConflict }}
            >
            </div>
    </div>)

}

export default BuildContainerForSprite