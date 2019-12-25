import React, {FunctionComponent} from "react";

export interface IContainerSprite {
    className: string
    zIndex?: number,
    width: number,
    height: number,
    x: number,
    y: number,
    sprite: number,
    src: string,
    behavior?: number
}

const ImgSprite = ({src, sprite = 0, behavior = 0}: any) => {
    return <img src={src} style={{left: sprite + 'px', top: behavior + 'px', position: 'absolute'}} />
}


const BuildContainerForSprite:FunctionComponent<IContainerSprite> = ({zIndex = 20, width, height, x, y, behavior = 0, sprite = 0, className, src}) => {
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
                top:y,
                zIndex:zIndex
            }
        }
      >
        <ImgSprite
            src={src}
            behavior={behavior}
            sprite={sprite}
        />
    </div>)

}

export default BuildContainerForSprite