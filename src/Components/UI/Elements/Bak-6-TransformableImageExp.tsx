import {
  Fragment,
  // useEffect, useState,
  useRef,
} from "react";
import { Group, Image, Rect, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";

import { useTransformer } from "Hooks";

export const TransformableImageExp = ({
  onDragStart,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  maxWidth,
  src,
  rgb,
  filters,
  draggable,
  lock,
  isCropping,
  clipData,
  canvasHeight,
  canvasWidth,
  ...props
}: {
  onDragStart: (element: Konva.ShapeConfig) => void;
  onDragEnd: (e: any) => void;
  onTransform: (e: any) => void;
  onClick: (e: any) => void;
  isSelected: boolean;
  src: Konva.ImageConfig["image"];
  maxWidth: number;
  [key: string]: any;
  canvasWidth: number;
  canvasHeight: number;
}) => {
  // const [height, setHeight] = useState<number>(0);
  // const [width, setWidth] = useState<number>(0);
  const rootGroupRef = useRef<Konva.Group | any>();
  const darkImageRef = useRef<Konva.Image | any>();
  const clipRectRef = useRef<Konva.Rect | any>();
  const imageRef = useRef<Konva.Image | any>();

  const rootTransformerRef = useRef<Konva.Transformer | any>();
  // const darkTransformerRef = useRef<Konva.Transformer | any>();
  const rectTransformerRef = useRef<Konva.Transformer | any>();

  useTransformer({
    isSelected,
    ref: rootGroupRef,
    transformer: rootTransformerRef,
  });

  useTransformer({
    isSelected: isCropping,
    ref: clipRectRef,
    transformer: rectTransformerRef,
  });

  // useElementCache({
  //   ref: imageRef,
  //   deps: [isSelected, props],
  // });

  console.log(props.height, clipData.height, clipData.height < props.height);

  return (
    <Fragment>
      <Image
        ref={darkImageRef}
        x={props.x}
        y={props.y}
        image={src}
        scaleX={props.scaleX}
        scaleY={props.scaleY}
        offsetX={props.width}
        offsetY={props.height}
        height={props.height}
        width={props.width}
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
      <Group
        ref={rootGroupRef}
        {...props}
        x={props.x}
        y={props.y}
        scaleX={Math.abs(props.scaleX)}
        scaleY={Math.abs(props.scaleY)}
        height={props.height}
        width={props.width}
        offsetX={props.width / 2}
        offsetY={props.height / 2}
        // clip={clipData}
        onClick={onClick}
        draggable={!lock ? draggable : false}
        onDragStart={onDragStart}
        onDragEnd={(e) => onDragEnd(e)}
        onTransformEnd={() => {
          const node = rootGroupRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            onTransform({
              ...props,
              rotation: node.rotation(),
              x: node.x(),
              y: node.y(),
              width: node.width() * scaleX,
              height: node.height() * scaleY,
            });
          }
        }}
      >
        <Image
          ref={imageRef}
          image={src}
          scaleX={props.scaleX}
          scaleY={props.scaleY}
          offsetX={props.width / 2}
          offsetY={props.height / 2}
          height={props.height}
          width={props.width}
          filters={[...filters, ...(rgb ? [Konva.Filters.RGB] : [])]}
        />
      </Group>
      {isSelected && (
        <Portal selector=".top-layer" enabled={isSelected}>
          <Transformer
            ref={rootTransformerRef}
            borderStroke={"#129FEE"}
            borderStrokeWidth={2}
            anchorStroke={"#129FEE"}
            anchorStrokeWidth={1.5}
            anchorSize={9}
            rotateAnchorOffset={30}
            keepRatio={true}
            flipEnabled={true}
            rotateEnabled={!lock}
            enabledAnchors={
              !lock
                ? ["top-left", "top-right", "bottom-right", "bottom-left"]
                : []
            }
            boundBoxFunc={(oldBox, newBox) =>
              newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
            }
          />
        </Portal>
      )}
      <Rect
        ref={clipRectRef}
        visible={isCropping}
        scaleX={clipData.scaleX}
        scaleY={clipData.scaleY}
        x={clipData.x}
        y={clipData.y}
        offsetX={clipData.width / 2}
        offsetY={clipData.height / 2}
        width={clipData.width}
        height={clipData.height}
        draggable
        onDragMove={(e) => {
          const node = e.target;
          console.log(node.x());
          onTransform({
            ...props,
            clipData: {
              ...clipData,
              x: node.x(),
              y: node.y(),
            },
          });
        }}
        onTransform={(e) => {
          const node = e.target;
          onTransform({
            ...props,
            clipData: {
              ...clipData,
              x: node.x(),
              y: node.y(),
              width: node.width() * node.scaleX(),
              height: node.height() * node.scaleY(),
            },
          });
        }}
      />
      {isCropping && (
        <Portal selector=".top-layer" enabled={isCropping}>
          <Transformer
            ref={rectTransformerRef}
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
      )}
    </Fragment>
  );
};
