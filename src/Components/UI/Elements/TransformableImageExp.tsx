import {
  FC,
  Fragment,
  // useEffect, useState,
  useRef,
  RefObject,
} from "react";
import { Group, Image, Rect, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import { useTransformer } from "Hooks";
import { ImageElement } from "Interfaces/Elements";

interface ClipData {
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
}

interface TransformableImageExpProps {
  onDragStart: (element: ImageElement) => void;
  onDragEnd: (e: KonvaEventObject<DragEvent>) => void;
  onTransform: (config: Partial<ImageElement>) => void;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
  isSelected: boolean;
  src: HTMLImageElement;
  maxWidth: number;
  canvasWidth: number;
  canvasHeight: number;
  rgb?: boolean;
  filters?: Array<(imageData: ImageData) => void>;
  draggable?: boolean;
  lock?: boolean;
  isCropping?: boolean;
  clipData?: ClipData;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotation?: number;
  id: string;
  type: "image";
}

export const TransformableImageExp: FC<TransformableImageExpProps> = ({
  onDragStart,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  maxWidth,
  src,
  rgb = false,
  filters = [],
  draggable = true,
  lock = false,
  isCropping = false,
  clipData = { x: 0, y: 0, width: 100, height: 100, scaleX: 1, scaleY: 1 },
  canvasHeight,
  canvasWidth,
  ...props
}) => {
  // const [height, setHeight] = useState<number>(0);
  // const [width, setWidth] = useState<number>(0);
  const rootGroupRef = useRef<Konva.Group>(null);
  const darkImageRef = useRef<Konva.Image>(null);
  const clipRectRef = useRef<Konva.Rect>(null);
  const imageRef = useRef<Konva.Image>(null);

  const rootTransformerRef = useRef<Konva.Transformer>(null) as RefObject<Konva.Transformer>;
  // const darkTransformerRef = useRef<Konva.Transformer>(null);
  const rectTransformerRef = useRef<Konva.Transformer>(null) as RefObject<Konva.Transformer>;

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

  console.log(clipData);

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
        onClick={onClick}
        draggable={!lock ? draggable : false}
        onDragStart={() => onDragStart(props as ImageElement)}
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
        onDragMove={() => {
          // const node = e.target;
          // onTransform({
          //   ...props,
          //   clipData: {
          //     ...clipData,
          //     x: node.x(),
          //     y: node.y(),
          //   },
          // });
        }}
        onTransform={() => {
          // const node = e.target;
          // onTransform({
          //   ...props,
          //   clipData: {
          //     ...clipData,
          //     x: node.x(),
          //     y: node.y(),
          //     width: node.width() * node.scaleX(),
          //     height: node.height() * node.scaleY(),
          //   },
          // });
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
