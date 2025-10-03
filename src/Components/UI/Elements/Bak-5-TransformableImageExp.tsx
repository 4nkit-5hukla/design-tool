import { Fragment, useEffect, useState, useRef } from "react";
import { Group, Image, Rect, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";
import useImage from "use-image";

import { useElementCache, useTransformer } from "Hooks";

export const TransformableImageExp = ({
  onDragStart,
  onDragMove,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  isCropping,
  maxWidth,
  image,
  src,
  rgb,
  filters,
  draggable,
  lock,
  canvasHeight,
  canvasWidth,
  stage,
  crop,
  ...props
}: {
  onDragStart: (element: Konva.ShapeConfig) => void;
  onDragMove: (e: any) => void;
  onDragEnd: (e: any) => void;
  onTransform: (e: any) => void;
  onClick: (e: any) => void;
  isSelected: boolean;
  image: Konva.ImageConfig["image"];
  src: string;
  maxWidth: number;
  [key: string]: any;
  canvasWidth: number;
  canvasHeight: number;
  stage: any;
  crop: boolean;
}) => {
  const [clipData, updateClipData] = useState<any>({
    height: props.height,
    width: props.width,
    x: props.x,
    y: props.y,
  });
  const [loadedImage] = useImage(src);
  const [loadImage, setLoadImage] = useState<any>();
  const imageRef = useRef<Konva.Image | any>();
  const igRef = useRef<Konva.Group | any>();
  const darkImageRef = useRef<Konva.Image | any>();
  const clipRectRef = useRef<Konva.Rect | any>();
  const transformerIgRef = useRef<Konva.Transformer | any>();
  const darkTransformerRef = useRef<Konva.Transformer | any>();
  const transformerRectRef = useRef<Konva.Transformer | any>();

  useTransformer({
    isSelected,
    ref: igRef,
    transformer: transformerIgRef,
  });

  useTransformer({
    isSelected: isCropping,
    ref: clipRectRef,
    transformer: transformerRectRef,
  });

  useTransformer({
    isSelected: isCropping,
    ref: darkImageRef,
    transformer: darkTransformerRef,
  });

  // useElementCache({
  //   ref: darkImageRef,
  //   deps: [isCropping, props],
  // });

  // useElementCache({
  //   ref: clipRectRef,
  //   deps: [isCropping, props],
  // });

  // useElementCache({
  //   ref: imageRef,
  //   deps: [isSelected, props],
  // });

  // useEffect(() => {
  //   if (crop) {
  //     // apply crop
  //     // onTransform({
  //     //   ...props,
  //     // });
  //   }
  // }, [crop]);

  // useEffect(() => {
  //   if (!isCropping) {
  //     // cancel crop
  //     updateClipData({
  //       height: props.height,
  //       width: props.width,
  //       x: props.x,
  //       y: props.y,
  //     });
  //   }
  // }, [isCropping]);

  useEffect(() => {
    if (image) {
      setLoadImage(image);
    } else if (loadedImage) {
      setLoadImage(loadedImage);
    }
  }, [image, loadedImage]);

  console.log(props.x, props.y);

  return (
    <Fragment>
      <Image
        {...props}
        id={`darkImg-${props.id}`}
        ref={darkImageRef}
        image={loadImage}
        src={src}
        visible={isCropping}
        opacity={0.5}
        fill="#000000"
        strokeWidth={1}
        dash={[3, 3]}
        // draggable
        // onDragStart={onDragStart}
        // // onDragEnd={(e) => onDragEnd(e)}
        // onDragMove={(e) => {
        //   onDragMove(e);
        // }}
        // onTransform={() => {
        //   const node = imageRef.current;
        //   if (node) {
        //     const scaleX = node.scaleX();
        //     const scaleY = node.scaleY();
        //     node.scaleX(1);
        //     node.scaleY(1);
        //     onTransform({
        //       ...props,
        //       rotation: node.rotation(),
        //       x: node.x(),
        //       y: node.y(),
        //       width: node.width() * scaleX,
        //       height: node.height() * scaleY,
        //     });
        //   }
        // }}
      />
      <Portal selector=".top-layer" enabled={isCropping}>
        <Transformer
          ref={darkTransformerRef}
          visible={isCropping}
          borderStroke={"#129FEE"}
          borderStrokeWidth={2}
          anchorStroke={"#129FEE"}
          anchorStrokeWidth={1.5}
          anchorSize={18}
          anchorCornerRadius={9}
          rotateAnchorOffset={30}
          // keepRatio={true}
          flipEnabled={false}
          rotateEnabled={!lock}
          enabledAnchors={
            !lock
              ? [
                  "top-left",
                  "top-center",
                  "top-right",
                  "middle-right",
                  "bottom-right",
                  "bottom-center",
                  "bottom-left",
                  "middle-left",
                ]
              : []
          }
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
          }
        />
      </Portal>
      <Group
        id={`imgGroup${props.id}`}
        ref={igRef}
        {...props}
        x={props.x}
        y={props.y}
        scaleX={Math.abs(props.scaleX)}
        scaleY={Math.abs(props.scaleY)}
        height={props.height}
        width={props.width}
        offsetX={props.width / 2}
        offsetY={props.height / 2}
        onClick={onClick}
        onDragStart={onDragStart}
        onDragEnd={(e) => onDragEnd(e)}
      >
        <Image
          ref={imageRef}
          filters={[...filters, ...(rgb ? [Konva.Filters.RGB] : [])]}
          image={loadImage}
          src={src}
          scaleX={props.scaleX}
          scaleY={props.scaleY}
          offsetX={props.width / 2}
          offsetY={props.height / 2}
          // onTransform={() => {
          //   const node = imageRef.current;
          //   if (node) {
          //     const scaleX = node.scaleX();
          //     const scaleY = node.scaleY();
          //     node.scaleX(1);
          //     node.scaleY(1);
          //     onTransform({
          //       ...props,
          //       rotation: node.rotation(),
          //       x: node.x(),
          //       y: node.y(),
          //       width: node.width() * scaleX,
          //       height: node.height() * scaleY,
          //     });
          //   }
          // }}
          onTransformEnd={(e) => {
            const node = igRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onTransform({
              ...props,
              rotation: node.rotation(),
              x: node.x(),
              y: node.y(),
              scaleX,
              scaleY,
              width: node.width() * scaleX,
              height: node.height() * scaleY,
            });
          }}
        />
      </Group>
      <Portal selector=".top-layer" enabled={isSelected && !isCropping}>
        <Transformer
          ref={transformerIgRef}
          visible={isSelected && !isCropping}
          borderStroke={"#129FEE"}
          borderStrokeWidth={2}
          anchorStroke={"#129FEE"}
          anchorStrokeWidth={1.5}
          anchorSize={9}
          anchorCornerRadius={0}
          rotateAnchorOffset={30}
          // keepRatio={true}
          flipEnabled={true}
          rotateEnabled={!lock}
          enabledAnchors={
            !lock
              ? [
                  "top-left",
                  "top-center",
                  "top-right",
                  "middle-right",
                  "bottom-right",
                  "bottom-center",
                  "bottom-left",
                  "middle-left",
                ]
              : []
          }
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
          }
        />
      </Portal>
      <Rect
        ref={clipRectRef}
        visible={isCropping}
        x={clipData.x}
        y={clipData.y}
        width={props.width}
        height={props.height}
        onClick={onClick}
        draggable
        onDragMove={(e) => {
          const node = e.target;
          if (
            (node.x() >= props.x &&
              node.x() + clipData.width <= props.x + props.width) ||
            (node.y() >= props.y &&
              node.y() + clipData.height <= props.y + props.height)
          ) {
            updateClipData({
              ...clipData,
              x: node.x(),
              y: node.y(),
            });
          } else {
            // node.stopDrag();
          }
        }}
        onTransform={(e) => {
          const node = e.target;
          updateClipData({
            x: node.x(),
            y: node.y(),
            width: node.width() * node.scaleX(),
            height: node.height() * node.scaleY(),
          });
        }}
      />
      <Portal selector=".top-layer" enabled={isCropping}>
        <Transformer
          ref={transformerRectRef}
          visible={isCropping}
          borderStroke={"#129FEE"}
          borderStrokeWidth={2}
          anchorStroke={"#129FEE"}
          anchorStrokeWidth={1.5}
          anchorSize={9}
          anchorCornerRadius={0}
          keepRatio={false}
          flipEnabled={false}
          rotateEnabled={false}
          enabledAnchors={
            !lock
              ? [
                  "top-left",
                  "top-right",
                  "middle-right",
                  "bottom-right",
                  "bottom-left",
                  "middle-left",
                ]
              : []
          }
          boundBoxFunc={(oldBox, newBox) =>
            newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
          }
        />
      </Portal>
    </Fragment>
  );
};
