import { useRef, useState } from "react";
import { Image, Rect, Transformer, Group, Path } from "react-konva";
import SVGPathCommander from "svg-path-commander";

const Anchor = {
  none: 0,
  topLeft: 1,
  topRight: 3,
  bottomLeft: 6,
  bottomRight: 8,
};

export function ClippedImage({
  state,
  setState,
  isSelected,
  onClick,
  onDragMove,
  onDragEnd,
  onMouseDown,
}) {
  const [activeAnchor, setActiveAnchor] = useState(Anchor.none);

  // refs
  const refs = {
    group: useRef(null),
    image: useRef(null),
    transformer: useRef(null),
    rect: useRef(null),
    darkerGroup: useRef(null),
    darker: useRef(null),
    shadow: useRef(null),
  };
  const refsReady = Object.values(refs).every((ref) => ref.current);
  const group = refs.group.current;
  const image = refs.image.current;
  const transformer = refs.transformer.current;
  const rect = refs.rect.current;
  const darkerGroup = refs.darkerGroup.current;
  const darker = refs.darker.current;
  const shadow = refs.shadow.current;

  const {
    image: imageObj,
    imageDeltaX,
    imageDeltaY,
    imageWidth,
    imageHeight,
    shapeX,
    shapeY,
    shapeWidth,
    shapeHeight,
    isClipping,
    src,
    flipX,
    flipY,
  } = state;

  if (refsReady) {
    // init transformer
    if (transformer.nodes().length === 0) {
      transformer.nodes([rect]);
      for (const anchor of Object.values(Anchor)) {
        if (anchor === 0) continue;
        transformer.children[anchor].on("mouseenter", () => {
          if (anchor !== activeAnchor) setActiveAnchor(anchor);
        });
      }
    }
  }

  // imageObj is empty
  if (!imageObj.src) {
    const image = new window.Image();
    image.src = src;
    image.crossOrigin = "anonymous";
    image.addEventListener("load", () => {
      setState({ ...state, image });
    });
    return <></>;
  }

  const clipFuncHelper = new ClipFuncHelper(state);

  const getRadSinCos = (state) => {
    const rad = (state.rotation / 180) * Math.PI;
    return {
      rad,
      cos: Math.cos(rad),
      sin: Math.sin(rad),
    };
  };

  const getTempState = () => {
    const rotation = rect.rotation();
    const { cos, sin } = getRadSinCos({ rotation });
    const rectWidth = rect.width() * rect.scaleX();
    const rectHeight = rect.height() * rect.scaleY();
    const rectX = rect.x();
    const rectY = rect.y();
    if (isClipping) {
      return {
        ...state,
        imageDeltaX: (rectY - shapeY) * sin + (rectX - shapeX) * cos,
        imageDeltaY: (rectY - shapeY) * cos - (rectX - shapeX) * sin,
        imageWidth: rectWidth,
        imageHeight: rectHeight,
        rotation,
      };
    } else {
      return {
        ...state,
        imageDeltaX: imageDeltaX * rect.scaleX(),
        imageDeltaY: imageDeltaY * rect.scaleY(),
        imageWidth: (imageWidth / shapeWidth) * rectWidth,
        imageHeight: (imageHeight / shapeHeight) * rectHeight,
        rotation: rotation,
        shapeX: rectX,
        shapeY: rectY,
        shapeWidth: rectWidth,
        shapeHeight: rectHeight,
      };
    }
  };

  const boundBoxFunc = (oldBox, newBox) => {
    const { cos } = getRadSinCos(state);
    if (newBox.width < 10 || newBox.height < 10) return oldBox;
    if (!isClipping) return newBox;
    const {
      shapeWidth,
      shapeHeight,
      imageDeltaX,
      imageDeltaY,
      imageWidth,
      imageHeight,
    } = getTempState();
    const maxX = shapeWidth / 2 - imageWidth / 2;
    const maxY = shapeHeight / 2 - imageHeight / 2;
    const dx = imageDeltaX + maxX;
    const dy = imageDeltaY + maxY;
    const dw = -imageDeltaX + maxX;
    const dh = -imageDeltaY + maxY;
    const xIncreasing = (newBox.x - oldBox.x) * cos > 0;
    const yIncreasing = (newBox.y - oldBox.y) * cos > 0;
    const wDecreasing = newBox.width < oldBox.width;
    const hDecreasing = newBox.height < oldBox.height;
    const leftAnchor =
      activeAnchor === Anchor.topLeft || activeAnchor === Anchor.bottomLeft;
    const rightAnchor =
      activeAnchor === Anchor.topRight || activeAnchor === Anchor.bottomRight;
    const topAnchor =
      activeAnchor === Anchor.topLeft || activeAnchor === Anchor.topRight;
    const bottomAnchor =
      activeAnchor === Anchor.bottomLeft || activeAnchor === Anchor.bottomRight;
    if (
      (leftAnchor && dx > 0 && xIncreasing) ||
      (topAnchor && dy > 0 && yIncreasing) ||
      (rightAnchor && dw > 0 && wDecreasing) ||
      (bottomAnchor && dh > 0 && hDecreasing)
    ) {
      return oldBox;
    }
    return newBox;
  };

  const imageScale = {
    scaleX: flipX ? -1.0 : 1.0,
    scaleY: flipY ? -1.0 : 1.0,
  };

  // events
  const groupOnClick = (e) => {
    onClick(e);
  };

  const groupOnDblClick = () => {
    setState({ ...state, isClipping: !state.isClipping });
  };

  const groupOnDragMove = (ev) => {
    onDragMove(ev);
    if (!isClipping) shadow.setAttrs({ visible: false });
    const dx = ev.target.x();
    const dy = ev.target.y();
    if (!isClipping) {
      rect.setAttrs({
        x: shapeX + dx,
        y: shapeY + dy,
      });
      return;
    }
    const { sin, cos } = getRadSinCos(state);
    const imageDeltaX = state.imageDeltaX + dx * cos + dy * sin;
    const imageDeltaY = state.imageDeltaY - dx * sin + dy * cos;
    const ip = imageProps({
      ...state,
      imageDeltaX,
      imageDeltaY,
    });
    const maxX = shapeWidth / 2 - imageWidth / 2;
    const maxY = shapeHeight / 2 - imageHeight / 2;
    const boundX = imageDeltaX + maxX;
    const boundY = imageDeltaY + maxY;
    const boundW = -imageDeltaX + maxX;
    const boundH = -imageDeltaY + maxY;
    if (boundX > 0) {
      ip.x -= boundX * cos;
      ip.y -= boundX * sin;
    }
    if (boundY > 0) {
      ip.x += boundY * sin;
      ip.y -= boundY * cos;
    }
    if (boundW > 0) {
      ip.x += boundW * cos;
      ip.y += boundW * sin;
    }
    if (boundH > 0) {
      ip.x -= boundH * sin;
      ip.y += boundH * cos;
    }
    darkerGroup.setAttrs({ x: 0, y: 0 });
    group.setAttrs({ x: 0, y: 0 });
    rect.setAttrs(ip);
    darker.setAttrs(ip);
    image.setAttrs({ ...ip, ...imageScale });
    const ts = getTempState();
    darkerGroup.setAttrs({
      clipFunc: clipFuncHelper.darker(ts, imageProps(ts)),
    });
  };

  const groupOnDragEnd = (ev) => {
    onDragEnd(ev);
    if (!isClipping) shadow.setAttrs({ visible: true });
    ev.target.setAttrs({ x: 0, y: 0 });
  };

  const rectOnTransform = () => {
    if (!isClipping) shadow.setAttrs({ visible: false });
    const ts = getTempState();
    const ip = imageProps(ts);
    image.setAttrs({ ...ip, ...imageScale });
    if (isClipping) {
      darker.setAttrs(ip);
      group.setAttrs({ clipFunc: clipFuncHelper.group(ts, isClipping) });
      darkerGroup.setAttrs({
        clipFunc: clipFuncHelper.darker(ts, imageProps(ts)),
      });
    } else {
      group.setAttrs({ clipFunc: clipFuncHelper.group(ts, isClipping) });
    }
  };

  const rectOnTransformEnd = () => {
    if (!isClipping) shadow.setAttrs({ visible: true });
    const ts = getTempState();
    rect.setAttrs(rectProps(ts));
    const {
      imageDeltaX,
      imageDeltaY,
      imageWidth,
      imageHeight,
      shapeWidth,
      shapeHeight,
    } = ts;
    const k = Math.max(
      1.0,
      (2 * imageDeltaX + shapeWidth) / imageWidth,
      (2 * imageDeltaY + shapeHeight) / imageHeight,
      (-2 * imageDeltaX + shapeWidth) / imageWidth,
      (-2 * imageDeltaY + shapeHeight) / imageHeight
    );
    setState({
      ...ts,
      imageWidth: ts.imageWidth * k,
      imageHeight: ts.imageHeight * k,
    });
  };

  // render helpers
  const rectProps = (state) => {
    if (isClipping) {
      return imageProps(state);
    } else {
      return {
        x: state.shapeX,
        y: state.shapeY,
        width: state.shapeWidth,
        height: state.shapeHeight,
        offsetX: state.shapeWidth / 2,
        offsetY: state.shapeHeight / 2,
        rotation: state.rotation,
        scaleX: 1.0,
        scaleY: 1.0,
      };
    }
  };

  const imageProps = (state) => {
    const {
      shapeX,
      shapeY,
      imageDeltaX,
      imageDeltaY,
      imageWidth,
      imageHeight,
      rotation,
    } = state;
    const width = imageWidth;
    const height = imageHeight;
    const offsetX = imageWidth / 2;
    const offsetY = imageHeight / 2;
    if (isClipping) {
      const { sin, cos } = getRadSinCos(state);
      return {
        x: shapeX + imageDeltaX * cos - imageDeltaY * sin,
        y: shapeY + imageDeltaX * sin + imageDeltaY * cos,
        width,
        height,
        offsetX,
        offsetY,
        rotation,
        scaleX: 1.0,
        scaleY: 1.0,
      };
    } else {
      return {
        x: shapeX,
        y: shapeY,
        width,
        height,
        offsetX: flipX ? offsetX + imageDeltaX : offsetX - imageDeltaX,
        offsetY: flipY ? offsetY + imageDeltaY : offsetY - imageDeltaY,
        rotation,
        scaleX: 1.0,
        scaleY: 1.0,
      };
    }
  };

  const stateImageProps = imageProps(state);

  const pathProps = () => {
    const {
      svgPath,
      shapeWidth,
      shapeHeight,
      shapeElement,
      stroke,
      strokeType,
      strokeWidth,
      rotation,
      shadowColor,
      shadowBlur,
      shadowOpacity,
      shadowEnabled,
    } = state;
    const { width, height } = shapeElement;
    const path = new SVGPathCommander(svgPath);
    const transform = {
      scale: [shapeWidth / width, shapeHeight / height],
    };
    const dash =
      strokeType === "long-dash"
        ? [(strokeWidth / 2) * 4, (strokeWidth / 2) * 2]
        : strokeType === "dash"
        ? [(strokeWidth / 2) * 1.5, (strokeWidth / 2) * 1.5]
        : [0];
    const { sin, cos } = getRadSinCos(state);
    const shadowOffsetX = state.shadowOffsetX * cos - state.shadowOffsetY * sin;
    const shadowOffsetY = state.shadowOffsetX * sin + state.shadowOffsetY * cos;
    return {
      visible: !isClipping,
      data: path.transform(transform).toString().replaceAll(",", " "),
      fill: "white",
      stroke,
      strokeWidth,
      dash,
      x: shapeX,
      y: shapeY,
      offsetX: width / 2,
      offsetY: height / 2,
      rotation,
      shadowColor,
      shadowBlur,
      shadowOffsetX,
      shadowOffsetY,
      shadowOpacity,
      shadowEnabled,
      ...imageScale,
    };
  };

  return (
    <>
      <Rect
        ref={refs.rect}
        onTransform={rectOnTransform}
        onTransformEnd={rectOnTransformEnd}
        {...rectProps(state)}
      />
      <Path ref={refs.shadow} id={"shadow" + state.id} {...pathProps()} />
      <Group
        ref={refs.group}
        id={"group" + state.id}
        clipFunc={clipFuncHelper.group(state, isClipping)}
        draggable={!state.lock}
        onClick={groupOnClick}
        onMouseDown={onMouseDown}
        onTap={groupOnClick}
        onDblClick={groupOnDblClick}
        onDblTap={groupOnDblClick}
        onDragStart={onClick}
        onDragMove={groupOnDragMove}
        onDragEnd={groupOnDragEnd}
      >
        <Image
          {...stateImageProps}
          {...imageScale}
          id={state.id}
          ref={refs.image}
          opacity={state.opacity}
          image={imageObj}
        />
      </Group>
      <Transformer
        ref={refs.transformer}
        boundBoxFunc={boundBoxFunc}
        keepRatio
        enabledAnchors={
          state.lock
            ? []
            : ["top-left", "top-right", "bottom-left", "bottom-right"]
        }
        rotateEnabled={!isClipping && !state.lock}
        visible={isSelected}
      />
      <Group
        ref={refs.darkerGroup}
        clipFunc={clipFuncHelper.darker(state, stateImageProps)}
        draggable={!state.lock}
        onClick={groupOnClick}
        onMouseDown={onMouseDown}
        onTap={groupOnClick}
        onDblClick={groupOnDblClick}
        onDblTap={groupOnDblClick}
        onDragStart={onClick}
        onDragMove={groupOnDragMove}
        onDragEnd={groupOnDragEnd}
      >
        <Rect
          ref={refs.darker}
          visible={isClipping}
          opacity={0.5}
          fill="black"
          {...stateImageProps}
        />
      </Group>
    </>
  );
}

export function flipClippedImage(element, orientation) {
  const { flipX, flipY, imageDeltaX, imageDeltaY } = element;
  if (orientation === "vertical") {
    return {
      ...element,
      flipY: !flipY,
      imageDeltaY: -imageDeltaY,
    };
  } else {
    return {
      ...element,
      flipX: !flipX,
      imageDeltaX: -imageDeltaX,
    };
  }
}

export function reversePath(path) {
  return SVGPathCommander.reversePath(path).toString().replaceAll(",", " ");
}

export class ClipFuncHelper {
  path;
  reversePath;
  width;
  height;

  constructor({ svgPath, shapeElement, flipX, flipY }) {
    this.width = shapeElement.width;
    this.height = shapeElement.height;
    const path1 = SVGPathCommander.normalizePath(svgPath);
    const path2 = SVGPathCommander.normalizePath(
      SVGPathCommander.reversePath(svgPath)
    );
    if (flipX === flipY) {
      this.path = path1;
      this.reversePath = path2;
    } else {
      this.path = path2;
      this.reversePath = path1;
    }
  }

  group(state, isClipping) {
    if (isClipping) return;
    const { shapeX, shapeY, shapeWidth, shapeHeight, rotation } = state;
    const rad = (rotation / 180) * Math.PI;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const point = (x, y) => {
      x = ((x - this.width / 2) * shapeWidth) / this.width;
      y = ((y - this.height / 2) * shapeHeight) / this.height;
      if (state.flipX) x = -x;
      if (state.flipY) y = -y;
      return [shapeX + x * cos - y * sin, shapeY + x * sin + y * cos];
    };
    return (ctx) => {
      const commands = this.commands(ctx, point);
      ctx.beginPath();
      for (const [code, ...args] of this.path) {
        const command = commands[code];
        if (command) command(...args);
      }
    };
  }

  darker(state, imageProps) {
    const { shapeX, shapeY, shapeWidth, shapeHeight, rotation } = state;
    const rad = (rotation / 180) * Math.PI;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const point = (x, y) => {
      x = ((x - this.width / 2) * shapeWidth) / this.width;
      y = ((y - this.height / 2) * shapeHeight) / this.height;
      if (state.flipX) x = -x;
      if (state.flipY) y = -y;
      return [shapeX + x * cos - y * sin, shapeY + x * sin + y * cos];
    };
    return (ctx) => {
      const commands = this.commands(ctx, (x, y) => [
        imageProps.x + x * cos - y * sin,
        imageProps.y + x * sin + y * cos,
      ]);
      const commands2 = this.commands(ctx, point);

      ctx.beginPath();
      const w = imageProps.width / 2;
      const h = imageProps.height / 2;
      commands.M(-w, -h);
      commands.L(w, -h);
      commands.L(w, h);
      commands.L(-w, h);
      commands.L(-w, -h);
      for (const [code, ...args] of this.reversePath) {
        const command = commands2[code];
        if (command) {
          command(...args);
        } else {
          console.error(`Unknown SVG path code: ${code}`);
        }
      }
    };
  }

  commands(ctx, point) {
    return {
      M: (x, y) => ctx.moveTo(...point(x, y)),
      L: (x, y) => ctx.lineTo(...point(x, y)),
      C: (x1, y1, x2, y2, x, y) =>
        ctx.bezierCurveTo(...point(x1, y1), ...point(x2, y2), ...point(x, y)),
      Q: (x1, y1, x, y) =>
        ctx.quadraticCurveTo(...point(x1, y1), ...point(x, y)),
      Z: () => ctx.closePath(),
    };
  }
}

export function alignClippedImage(element, canvas, align) {
  const [center, ...rest] = vertices(element);
  const cx = center.x;
  const cy = center.y;
  const xs = rest.map(({ x }) => x);
  const ys = rest.map(({ y }) => y);
  let shapeX = element.shapeX;
  let shapeY = element.shapeY;
  if (align === "top") shapeY = cy - Math.min(...ys);
  else if (align === "middle") shapeY = canvas.height / 2;
  else if (align === "bottom") shapeY = canvas.height - (Math.max(...ys) - cy);
  else if (align === "left") shapeX = cx - Math.min(...xs);
  else if (align === "center") shapeX = canvas.width / 2;
  else if (align === "right") shapeX = canvas.width - (Math.max(...xs) - cx);
  return { id: element.id, shapeX, shapeY };
}

function vertices(element) {
  const { rotation, shapeX: x, shapeY: y, shapeWidth, shapeHeight } = element;
  const cos = Math.cos((rotation / 180) * Math.PI);
  const sin = Math.sin((rotation / 180) * Math.PI);
  const absXY = (dx, dy) => ({
    x: x + dx * cos - dy * sin,
    y: y + dx * sin + dy * cos,
  });
  const widthHalf = shapeWidth / 2;
  const heightHalf = shapeHeight / 2;
  return [
    { x, y },
    absXY(-widthHalf, -heightHalf),
    absXY(widthHalf, -heightHalf),
    absXY(widthHalf, heightHalf),
    absXY(-widthHalf, heightHalf),
  ];
}
