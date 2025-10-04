import { FC, useEffect, useRef, useState } from "react";
import { Image, Rect, Circle, Transformer } from "react-konva";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import { CropableImageProps, ImageElementState } from "Interfaces";

const debug = false;

const Mode = {
  notSelectedNotCropped: 0,
  notSelectedCropped: 1,
  selectedNotCropped: 2,
  selectedCropped: 3,
  selectedCropping: 4,
};

const Anchor = {
  none: 0,
  topLeft: 1,
  topRight: 3,
  bottomLeft: 6,
  bottomRight: 8,
};

const Action = {
  none: 0,
  drag: 1,
  rotate: 2,
  outerTransform: 3,
  innerTransform: 4,
};

export const CropableImage: FC<CropableImageProps> = ({
  state,
  setState,
  isSelected,
  onMouseDown,
  onDragMove,
  onDragEnd,
  onClick,
}) => {
  // const counter = useRef(0);
  // counter.current = counter.current + 1;
  // console.log("image rendered: " + counter.current);

  // state
  const [action, setAction] = useState(Action.none);
  const [activeAnchor, setActiveAnchor] = useState(Anchor.none);

  // node refs
  const rectRef = useRef(null);
  const imageRef = useRef(null);
  const topDarkerRef = useRef(null);
  const leftDarkerRef = useRef(null);
  const rightDarkerRef = useRef(null);
  const bottomDarkerRef = useRef(null);
  const outerTrRef = useRef(null);
  const innerTrRef = useRef(null);
  const rect = rectRef.current;
  const image = imageRef.current;
  const topDarker = topDarkerRef.current;
  const leftDarker = leftDarkerRef.current;
  const rightDarker = rightDarkerRef.current;
  const bottomDarker = bottomDarkerRef.current;
  const outerTr = outerTrRef.current;
  const innerTr = innerTrRef.current;
  const refsReady =
    rect &&
    image &&
    topDarker &&
    leftDarker &&
    rightDarker &&
    bottomDarker &&
    outerTr &&
    innerTr;

  const {
    image: imageObj,
    name,
    x,
    y,
    width,
    height,
    innerOffsetX,
    innerOffsetY,
    innerWidth,
    innerHeight,
    flip,
    rotation,
    isCropped,
    isCropping,
  } = state;
  const aspectRatio = imageObj.width / imageObj.height;

  useEffect(() => {
    image && image.cache();
  }, [isSelected, state]);

  if (!state.scale) state.scale = 1.0;

  // imageObj is empty
  if (!imageObj.src) {
    const image = new window.Image();
    image.src = state.src;
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => {
      setState({ ...state, image });
    });
    image.addEventListener("error", async () => {
      // uneditable_shapes (e.g. instagram logo)
      const res = await fetch(state.src);
      const data = await res.text();
      image.src = "data:image/svg+xml;base64," + window.btoa(data);
    });
    return <Image id={state.id} />;
  }

  // derive tempState from konva nodes
  const getTempState = () => {
    if (!refsReady) return state;

    // cropped
    if (isCropped) {
      const tempState = {
        ...state,
        rotation: image.rotation(),
        x: image.x(),
        y: image.y(),
        scale: image.scaleX(),
      };
      return tempState;
    }

    // not cropped
    let tempState, scale;
    if (Math.abs(image.scaleX() - 1) > 0.001 && !isCropping) {
      const width = Math.abs(image.width() * image.scaleX());
      const height = Math.abs(image.height() * image.scaleY());
      scale = width / state.width;
      tempState = {
        ...state,
        x: image.x(),
        y: image.y(),
        width: width,
        height: height,
        innerOffsetX: state.innerOffsetX * scale,
        innerOffsetY: state.innerOffsetY * scale,
        innerWidth: state.innerWidth * rect.scaleX() * scale,
        innerHeight: state.innerHeight * rect.scaleY() * scale,
        rotation: image.rotation(),
        scale: 1.0,
      };
    } else {
      scale = image.scaleX();
      tempState = {
        ...state,
        x: image.x(),
        y: image.y(),
        width: image.width() * scale,
        height: image.height() * scale,
        innerOffsetX:
          activeAnchor === Anchor.topRight ||
          activeAnchor === Anchor.bottomRight
            ? rect.offsetX() * scale
            : (rect.offsetX() - (1 - rect.scaleX()) * rect.width()) * scale,
        innerOffsetY:
          activeAnchor === Anchor.bottomLeft ||
          activeAnchor === Anchor.bottomRight
            ? rect.offsetY() * scale
            : (rect.offsetY() - (1 - rect.scaleY()) * rect.height()) * scale,
        innerWidth: rect.width() * rect.scaleX() * scale,
        innerHeight: rect.height() * rect.scaleY() * scale,
        rotation: image.rotation(),
        scale: 1.0,
      };
    }

    // inner rect stays unmoved in some conditions
    if (
      action === Action.drag ||
      (action === Action.outerTransform && mode === Mode.selectedCropping)
    ) {
      const dx = tempState.x - rect.x();
      const dy = tempState.y - rect.y();
      tempState.innerOffsetX += dx * cos() + dy * sin();
      tempState.innerOffsetY -= dx * sin() - dy * cos();
      tempState.innerWidth /= scale;
      tempState.innerHeight /= scale;
      tempState.innerOffsetX /= scale;
      tempState.innerOffsetY /= scale;
    }

    // inner should be inside outer
    if (action === Action.innerTransform) {
      const dx = tempState.innerOffsetX - image.offsetX();
      if (dx > 0) {
        tempState = {
          ...tempState,
          innerOffsetX: tempState.innerOffsetX - dx,
          innerWidth: tempState.innerWidth - dx,
        };
      }
      const dy = tempState.innerOffsetY - image.offsetY();
      if (dy > 0) {
        tempState = {
          ...tempState,
          innerOffsetY: tempState.innerOffsetY - dy,
          innerHeight: tempState.innerHeight - dy,
        };
      }
      const dWidth =
        tempState.innerWidth - tempState.innerOffsetX - tempState.width / 2;
      if (dWidth > 0) {
        tempState = {
          ...tempState,
          innerWidth: tempState.innerWidth - dWidth,
        };
      }
      const dHeight =
        tempState.innerHeight -
        tempState.innerOffsetY -
        tempState.width / aspectRatio / 2;
      if (dHeight > 0) {
        tempState = {
          ...tempState,
          innerHeight: tempState.innerHeight - dHeight,
        };
      }
    }

    return tempState;
  };

  // actualize konva nodes according to temp state
  const updateNodes = () => {
    if (!refsReady || isCropped) return;
    const {
      x,
      y,
      width,
      innerOffsetX,
      innerOffsetY,
      innerWidth,
      innerHeight,
      rotation,
    } = getTempState();

    // not cropped
    const height = width / aspectRatio;
    rect.setAttrs({
      scaleX: 1,
      scaleY: 1,
      x: x,
      y: y,
      width: innerWidth,
      height: innerHeight,
      offsetX: innerOffsetX,
      offsetY: innerOffsetY,
      rotation: rotation,
      skewX: 0,
      skewY: 0,
    });
    topDarker.setAttrs({
      x: image.x(),
      y: image.y(),
      width: width,
      height: height / 2 - rect.offsetY(),
      offsetX: width / 2,
      offsetY: height / 2,
      rotation,
    });
    leftDarker.setAttrs({
      x: image.x(),
      y: image.y(),
      width: width / 2 - rect.offsetX(),
      height: rect.height(),
      offsetX: width / 2,
      offsetY: rect.offsetY(),
      rotation,
    });
    rightDarker.setAttrs({
      x: image.x(),
      y: image.y(),
      width: width / 2 - rect.width() + rect.offsetX(),
      height: rect.height(),
      offsetX: rect.offsetX() - rect.width(),
      offsetY: rect.offsetY(),
      rotation,
    });
    bottomDarker.setAttrs({
      x: image.x(),
      y: image.y(),
      width: width,
      height: height / 2 + rect.offsetY() - rect.height(),
      offsetX: width / 2,
      offsetY: rect.offsetY() - rect.height(),
      rotation,
    });
  };

  // set real state
  const updateState = () => {
    if (!isCropped) {
      const width = getTempState().width;
      const height = width / aspectRatio;
      const imageAttrs = {
        scaleX: 1,
        scaleY: 1 * Math.sign(image.scaleY()),
        width: width,
        height: height,
        offsetX: width / 2,
        offsetY: height / 2,
      };
      image.setAttrs(imageAttrs);
    }

    const ts = getTempState();
    if (action === Action.outerTransform) {
      const dw = (ts.innerWidth - ts.innerOffsetX) * 2 - ts.width;
      const dh =
        (ts.innerHeight - ts.innerOffsetY) * 2 - ts.width / aspectRatio;
      const dx = ts.innerOffsetX * 2 - ts.width;
      const dy = ts.innerOffsetY * 2 - ts.width / aspectRatio;
      if (dw > 0) ts.width += dw;
      if (dh > 0) ts.width += dh * aspectRatio;
      if (dx > 0) ts.width += dx;
      if (dy > 0) ts.width += dy * aspectRatio;
    }
    setState(ts);
    setAction(Action.none);
  };

  // mode
  const mode =
    isSelected && isCropping
      ? Mode.selectedCropping
      : !isSelected && !isCropped
      ? Mode.notSelectedNotCropped
      : !isSelected && isCropped
      ? Mode.notSelectedCropped
      : isSelected && !isCropped
      ? Mode.selectedNotCropped
      : isSelected && isCropped
      ? Mode.selectedCropped
      : Mode.notSelectedNotCropped;

  // select helpers
  const select = (e: KonvaEventObject<MouseEvent>) => {
    setAction(Action.none);
    setState({ ...state, ...getTempState(), isCropped, isCropping });
    onClick(e); // from props
  };

  // angle helpers
  const radRotation = () => (imageRef.current.rotation() / 180) * Math.PI;
  const cos = () => Math.cos(radRotation());
  const sin = () => Math.sin(radRotation());

  // events
  const imageOnClick = (e: KonvaEventObject<MouseEvent>) => {
    select(e);
  };

  const imageOnDragMove = (e: KonvaEventObject<DragEvent>) => {
    onDragMove(e);
    const image = imageRef.current;
    const rect = rectRef.current;
    if (!image || !rect) {
      return;
    }
    if (mode !== Mode.selectedCropping) {
      rect.setAttrs({ x: image.x(), y: image.y() });
      return;
    }
    const tempState = getTempState();
    const dx = tempState.innerOffsetX - tempState.width / 2;
    if (dx > 0) {
      image.x(image.x() - dx * cos());
      image.y(image.y() - dx * sin());
    }
    const dy = tempState.innerOffsetY - tempState.width / aspectRatio / 2;
    if (dy > 0) {
      image.x(image.x() + dy * sin());
      image.y(image.y() - dy * cos());
    }
    const dwidth =
      tempState.innerWidth - tempState.innerOffsetX - tempState.width / 2;
    if (dwidth > 0) {
      image.x(image.x() + dwidth * cos());
      image.y(image.y() + dwidth * sin());
    }
    const dheight =
      tempState.innerHeight -
      tempState.innerOffsetY -
      tempState.width / aspectRatio / 2;
    if (dheight > 0) {
      image.x(image.x() - dheight * sin());
      image.y(image.y() + dheight * cos());
    }
    updateNodes();
  };

  const imageOnTransform = () => {
    updateNodes();
  };

  const anyTransformDragEnd = (e: KonvaEventObject<DragEvent>) => {
    updateState();
    image.cache();
    onDragEnd(e);
  };

  const outerBoundBoxFunc = (oldBox: any, newBox: any) => {
    if (oldBox.rotation !== newBox.rotation) return newBox;
    if (newBox.width < 10 || newBox.height < 10) return oldBox;
    const image = imageRef.current;
    if (image === null) return;

    const { innerOffsetX, innerOffsetY, innerWidth, innerHeight, width } =
      getTempState();
    const height = width / aspectRatio;
    if (innerOffsetX > width / 2 && (newBox.x - oldBox.x) * cos() > 0)
      newBox = oldBox;
    if (innerOffsetY > height / 2 && (newBox.y - oldBox.y) * cos() > 0)
      newBox = oldBox;
    if (innerWidth - innerOffsetX > width / 2 && oldBox.width > newBox.width)
      newBox = oldBox;
    if (
      innerHeight - innerOffsetY > height / 2 &&
      oldBox.height > newBox.height
    )
      newBox = oldBox;
    return newBox;
  };

  // render helpers
  const cropScale = imageObj.width / state.width;
  const imageCrop = isCropped
    ? {
        x: (width / 2 - innerOffsetX) * cropScale,
        y: flip
          ? (height / 2 + innerOffsetY - innerHeight) * cropScale
          : (height / 2 - innerOffsetY) * cropScale,
        width: innerWidth * cropScale,
        height: innerHeight * cropScale,
      }
    : { x: 0, y: 0, width: 0, height: 0 };
  const imageOffsetY = isCropped
    ? flip
      ? innerHeight - innerOffsetY
      : innerOffsetY
    : height / 2;
  const darkerProps = (ref: any) =>
    mode === Mode.selectedCropping
      ? {
          ref: ref,
          onClick: imageOnClick,
          onTap: imageOnClick,
          onDragStart: (e) => {
            setAction(Action.drag);
          },
          onDragMove: () => {
            const image = imageRef.current;
            const darker = ref.current;
            image.setAttrs({ x: darker.x(), y: darker.y() });
            imageOnDragMove();
            darker.setAttrs({ x: image.x(), y: image.y() });
          },
          onDragEnd: anyTransformDragEnd,
          x: x,
          y: y,
          rotation: rotation,
          fill: "rgba(0,0,0,0.5)",
          strokeWidth: 0,
          draggable: !state.lock,
          name: "darker",
        }
      : { visible: false, ref: ref };
  const enabledAnchors = state.lock
    ? []
    : ["top-left", "top-right", "bottom-left", "bottom-right"];

  if (imageObj.src && refsReady) {
    if (innerTr.nodes().length === 0) {
      image.cache();
      innerTr.nodes([rect]);
      for (const a of Object.values(Anchor)) {
        if (a === 0) continue;
        innerTr.children[a].on("mouseenter", () => {
          setActiveAnchor(a);
        });
      }
    }
    if (outerTr.nodes().length === 0) {
      outerTr.nodes([image]);
    }
  }

  return (
    <>
      {debug && [
        <Rect
          x={x}
          y={y}
          width={width}
          height={height}
          offsetX={width / 2}
          offsetY={height / 2}
          rotation={rotation}
          stroke="red"
          scaleX={state.scale}
          scaleY={state.scale}
          key={0}
        ></Rect>,
        <Rect
          x={x}
          y={y}
          width={innerWidth}
          height={innerHeight}
          offsetX={innerOffsetX}
          offsetY={innerOffsetY}
          rotation={rotation}
          stroke="red"
          scaleX={state.scale}
          scaleY={state.scale}
          key={1}
        ></Rect>,
        ...vertices(state).map(({ x, y }, i) => (
          <Circle x={x} y={y} radius={10} stroke="red" key={i + 2} />
        )),
      ]}

      <Rect
        visible={debug}
        fill={debug ? "blue" : undefined}
        ref={rectRef}
        onClick={imageOnClick}
        onTap={imageOnClick}
        onTransformStart={() => setAction(Action.innerTransform)}
        onTransform={updateNodes}
        onTransformEnd={anyTransformDragEnd}
        x={x}
        y={y}
        width={innerWidth}
        height={innerHeight}
        offsetX={innerOffsetX}
        offsetY={innerOffsetY}
        rotation={rotation}
        scaleX={state.scale}
        scaleY={state.scale}
        opacity={debug ? 0.5 : undefined}
      />
      <Image
        ref={imageRef}
        id={state.id}
        onClick={imageOnClick}
        onTap={imageOnClick}
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
        onTransformStart={() => {
          setAction(Action.outerTransform);
        }}
        onTransform={imageOnTransform}
        onTransformEnd={anyTransformDragEnd}
        onDragStart={(e) => {
          setAction(Action.drag);
        }}
        onDragMove={imageOnDragMove}
        onDragEnd={anyTransformDragEnd}
        name={name}
        image={imageObj}
        x={x}
        y={y}
        width={isCropped ? innerWidth : width}
        height={isCropped ? innerHeight : height}
        offsetX={isCropped ? innerOffsetX : width / 2}
        offsetY={imageOffsetY}
        scaleX={state.scale}
        scaleY={flip ? -state.scale : state.scale}
        rotation={rotation}
        crop={imageCrop}
        draggable={!state.lock}
        opacity={debug ? 0.5 : state.opacity}
        shadowColor={state.shadowColor}
        shadowBlur={state.shadowBlur}
        shadowOffsetX={state.shadowOffsetX}
        shadowOffsetY={state.shadowOffsetY}
        shadowOpacity={state.shadowOpacity}
        shadowEnabled={state.shadowEnabled}
        filters={[
          ...[
            Konva.Filters.Blur,
            Konva.Filters.Brighten,
            Konva.Filters.Contrast,
            Konva.Filters.Enhance,
            Konva.Filters.HSL,
          ],
          ...(state.rgb ? [Konva.Filters.RGB] : []),
        ]}
        {...{
          blue: state.blue,
          blurRadius: state.blurRadius,
          brightness: state.brightness,
          contrast: state.contrast,
          enhance: state.enhance,
          green: state.green,
          red: state.red,
          rgb: state.rgb,
          saturation: state.saturation,
          strokeEnabled: state.strokeEnabled,
          stroke: state.stroke,
          strokeWidth: state.strokeWidth,
          strokeScaleEnabled: false,
        }}
      />
      <Rect
        {...darkerProps(topDarkerRef)}
        width={width * state.scale}
        height={(height / 2 - innerOffsetY) * state.scale}
        offsetX={(width / 2) * state.scale}
        offsetY={(height / 2) * state.scale}
      />
      <Rect
        {...darkerProps(leftDarkerRef)}
        width={(width / 2 - innerOffsetX) * state.scale}
        height={innerHeight * state.scale}
        offsetX={(width / 2) * state.scale}
        offsetY={innerOffsetY * state.scale}
      />
      <Rect
        {...darkerProps(rightDarkerRef)}
        width={(width / 2 - innerWidth + innerOffsetX) * state.scale}
        height={innerHeight * state.scale}
        offsetX={(innerOffsetX - innerWidth) * state.scale}
        offsetY={innerOffsetY * state.scale}
      />
      <Rect
        {...darkerProps(bottomDarkerRef)}
        width={width * state.scale}
        height={(height / 2 + innerOffsetY - innerHeight) * state.scale}
        offsetX={(width / 2) * state.scale}
        offsetY={(innerOffsetY - innerHeight) * state.scale}
      />
      <Transformer
        ref={outerTrRef}
        rotateEnabled={!state.lock}
        keepRatio
        enabledAnchors={enabledAnchors}
        boundBoxFunc={outerBoundBoxFunc}
        visible={
          mode === Mode.selectedCropped ||
          mode === Mode.selectedCropping ||
          mode === Mode.selectedNotCropped
        }
      />
      <Transformer
        ref={innerTrRef}
        rotateEnabled={false}
        keepRatio={false}
        enabledAnchors={enabledAnchors}
        boundBoxFunc={(oldBox, newBox) => {
          return newBox.width < 10 || newBox.height < 10 ? oldBox : newBox;
        }}
        visible={mode === Mode.selectedCropping}
      />
    </>
  );
};

export function flipImage(element: ImageElementState, orientation: string): Partial<ImageElementState> {
  const {
    id,
    innerWidth,
    innerOffsetX,
    innerHeight,
    innerOffsetY,
    rotation,
    x,
    y,
    scale,
    flip,
    isCropped,
  } = element;
  // not cropped
  if (!isCropped) {
    return {
      id,
      flip: !flip,
      rotation: orientation === "vertical" ? rotation : rotation + 180,
      innerOffsetY: innerHeight - innerOffsetY,
    };
  }
  // cropped
  const cos = Math.cos((rotation / 180) * Math.PI);
  const sin = Math.sin((rotation / 180) * Math.PI);
  if (orientation === "vertical") {
    const dy = innerHeight - 2 * innerOffsetY;
    return {
      id,
      flip: !flip,
      x: x - dy * sin * scale,
      y: y + dy * cos * scale,
      innerOffsetY: innerHeight - innerOffsetY,
    };
  } else {
    const dx = innerWidth - 2 * innerOffsetX;
    return {
      id,
      flip: !flip,
      rotation: rotation + 180,
      x: x + dx * cos * scale,
      y: y + dx * sin * scale,
      innerOffsetY: innerHeight - innerOffsetY,
    };
  }
}

export function alignImage(element: ImageElementState, canvas: { width: number; height: number }, align: string) {
  const [center, middle, ...rest] = vertices(element);
  const cx = center.x;
  const cy = center.y;
  const xs = rest.map(({ x }) => x);
  const ys = rest.map(({ y }) => y);
  let x = element.x;
  let y = element.y;
  if (align === "top") y = cy - Math.min(...ys);
  if (align === "middle") y = canvas.height / 2 + cy - middle.y;
  if (align === "bottom") y = canvas.height - (Math.max(...ys) - cy);
  if (align === "left") x = cx - Math.min(...xs);
  if (align === "center") x = canvas.width / 2 + cx - middle.x;
  if (align === "right") x = canvas.width - (Math.max(...xs) - cx);
  return { id: element.id, x, y };
}

function vertices(element: ImageElementState) {
  const {
    innerWidth,
    innerOffsetX,
    innerHeight,
    innerOffsetY,
    rotation,
    x,
    y,
    width,
    height,
    scale,
    isCropped,
  } = element;
  const cos = Math.cos((rotation / 180) * Math.PI);
  const sin = Math.sin((rotation / 180) * Math.PI);
  const absXY = (dx: number, dy: number) => ({
    x: x + dx * scale * cos - dy * scale * sin,
    y: y + dx * scale * sin + dy * scale * cos,
  });
  if (isCropped)
    return [
      { x, y },
      absXY(-innerOffsetX + innerWidth / 2, -innerOffsetY + innerHeight / 2),
      absXY(-innerOffsetX, -innerOffsetY),
      absXY(-innerOffsetX + innerWidth, -innerOffsetY),
      absXY(-innerOffsetX + innerWidth, -innerOffsetY + innerHeight),
      absXY(-innerOffsetX, -innerOffsetY + innerHeight),
    ];
  const widthHalf = width / 2;
  const heightHalf = height / 2;
  return [
    { x, y },
    { x, y },
    absXY(-widthHalf, -heightHalf),
    absXY(widthHalf, -heightHalf),
    absXY(widthHalf, heightHalf),
    absXY(-widthHalf, heightHalf),
  ];
}
