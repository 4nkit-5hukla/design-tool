import { Fragment, useEffect, useState, useRef } from "react";
import { Group, Image, Rect, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";

import { useElementCache, useTransformer } from "Hooks";

export const TransformableImageExp = ({
  onDragStart,
  onDragEnd,
  onClick,
  onTransform,
  isSelected,
  isCropping,
  maxWidth,
  src,
  rgb,
  filters,
  draggable,
  lock,
  canvasHeight,
  canvasWidth,
  stage,
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
  stage: any;
}) => {
  const [cropDetail, setCropDetail] = useState<any>({
    cropScaleX: null,
    cropScaleY: null,
    cropX: null,
    cropY: null,
    cropHeight: null,
    cropWidth: null,
    cropStart: false,
  });

  const { cropScaleX, cropScaleY, cropX, cropY, cropStart } = cropDetail;
  const darkImg = stage.findOne(
    (node: any) => node.id() === `darkImg${props.id}`
  );

  const imgRect = stage.findOne((node: any) => node.id() === props.id);

  const imgGroup = stage.findOne(
    (node: any) => node.id() === `imgGroup${props.id}`
  );

  const cropRect = stage.findOne(
    (node: any) => node.id() === `cropRect${props.id}`
  );
  const igRef = useRef<Konva.Group | any>();
  // const darkImageRef = useRef<Konva.Image | any>();
  const imageRef = useRef<Konva.Image | any>();
  const transformerRef = useRef<Konva.Transformer | any>();
  const cropRectRef = useRef<Konva.Rect | any>();
  const cropTransformerRef = useRef<Konva.Transformer | any>();

  useTransformer({
    isSelected,
    ref: igRef,
    transformer: transformerRef,
  });

  useTransformer({
    isSelected: isCropping,
    ref: cropRectRef,
    transformer: cropTransformerRef,
  });

  // useElementCache({
  //   ref: igRef,
  //   deps: [isSelected, props],
  // });

  // useElementCache({
  //   ref: imageRef,
  //   deps: [isSelected, props],
  // });

  useEffect(() => {
    const mainImg = stage.findOne((node: any) => node.id() === props.id);

    if (src) {
      // you many need to reapply cache on some props changes like shadow, stroke, etc.
      mainImg.cache();
      // since this update is not handled by "react-konva" and we are using Konva methods directly
      // we have to redraw layer manually

      mainImg.getLayer().batchDraw();
    }
  }, [src]);

  return (
    <Fragment>
      {/* <Image
        {...props}
        id={`darkImg-${props.id}`}
        ref={darkImageRef}
        image={src}
        visible={isCropping}
        opacity={0.5}
        fill="#000000"
        strokeWidth={1}
        dash={[3, 3]}
      /> */}
      <Group
        id={`imgGroup${props.id}`}
        ref={igRef}
        clip={{
          x: props.x,
          y: props.y,
          width: imgRect ? imgRect.width() : props.width,
          height: imgRect ? imgRect.height() : props.height,
        }}
        x={imgRect ? imgRect.x() - imgGroup.clipX() * imgGroup.scaleX() : 100}
        y={imgRect ? imgRect.y() - imgGroup.clipY() * imgGroup.scaleY() : 100}
        onClick={onClick}
        draggable={!lock ? draggable : false}
        onDragMove={(e) => {}}
      >
        <Image
          {...props}
          ref={imageRef}
          image={src}
          filters={[...filters, ...(rgb ? [Konva.Filters.RGB] : [])]}
          onDragStart={onDragStart}
          onDragEnd={(e) => onDragEnd(e)}
          onTransformEnd={() => {
            const node = imageRef.current;
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
        />
      </Group>
      {isSelected && (
        <Portal selector=".top-layer" enabled={isSelected}>
          <Transformer
            ref={transformerRef}
            borderStroke={"#129FEE"}
            borderStrokeWidth={2}
            anchorStroke={"#129FEE"}
            anchorStrokeWidth={1.5}
            anchorSize={isCropping ? 18 : 9}
            anchorCornerRadius={isCropping ? 9 : 0}
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
      {isCropping && (
        <Portal selector=".top-layer" enabled={isCropping}>
          <Rect
            visible={isCropping}
            ref={cropRectRef}
            fill="transparent"
            id={`cropRect${props.id}`}
            width={props.width}
            height={props.height}
            x={props.x}
            y={props.y}
            onDragMove={(e) => {
              const node = e.target;
              imgRect.setAttrs({
                x: node.x(),
                y: node.y(),
              });
            }}
            onTransform={(e) => {
              const node = e.target;
              node.setAttrs({
                width: node.width() * node.scaleX(),
                height: node.height() * node.scaleY(),
              });

              imgRect.setAttrs({
                x: node.x(),
                y: node.y(),
                width: node.scaleX() * node.width(),
                height: node.scaleY() * node.height(),
              });

              imgGroup.setAttrs({
                scaleX: imgRect.scaleX(),
                scaleY: imgRect.scaleY(),
                x: imgRect.x() - imgGroup.clipX() * imgGroup.scaleX(),
                y: imgRect.y() - imgGroup.clipY() * imgGroup.scaleY(),
              });

              setCropDetail({ ...cropDetail, cropWidth: node.width() });
            }}
            draggable
          />
          <Transformer
            ref={cropTransformerRef}
            borderStroke={"#129FEE"}
            borderStrokeWidth={2}
            anchorStroke={"#129FEE"}
            anchorStrokeWidth={1.5}
            anchorSize={9}
            rotateAnchorOffset={30}
            keepRatio={false}
            flipEnabled={false}
            rotateEnabled={false}
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
      )}
    </Fragment>
  );
};
