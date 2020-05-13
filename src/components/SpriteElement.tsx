import React, { FunctionComponent } from "react";

export interface IContainerSprite {
  className: string;
  zIndex?: number;
  width: number;
  height: number;
  exactSpriteConflict?: {};
  x: number;
  id?:string;
  y: number;
  sprite: number;
  src: string;
  behavior?: number;
}

const ImgSprite = React.memo(({ src, sprite = 0, behavior = 0 }: any) => {
  return (
    <img
      alt={src}
      src={src}
      style={{
        left: sprite + "px",
        top: behavior + "px",
        position: "absolute"
      }}
    />
  );
});

const BuildContainerForSprite: FunctionComponent<IContainerSprite> = React.memo(({
  zIndex = 20,
  width,
  height,
    id,
  x,
  y,
  behavior = 0,
  sprite = 0,
  className,
  src,
  exactSpriteConflict
}) => {
  return (
    <div
        id={id}
      className={className}
      style={{
        width,
        height,
        position: "absolute",
        overflow: "hidden",
        left: x,
        bottom: y,
        zIndex: zIndex
      }}
    >
      <ImgSprite
        src={src}
        alt={className}
        behavior={behavior}
        sprite={sprite}
      />
      <div
        className={"exactSprite-" + className}
        style={{ position: "absolute", ...exactSpriteConflict }}
      ></div>
    </div>
  );
});

export default BuildContainerForSprite;
