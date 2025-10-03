/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, useEffect, useRef } from "react";
import { Group, Path, Transformer } from "react-konva";
import { Portal } from "react-konva-utils";
import Konva from "konva";
import svgpath from "svgpath";

import { useTransformer } from "Hooks";

export const TransformableSVG = ({
  onClick,
  onMouseDown,
  onDragMove,
  onDragEnd,
  onTransform,
  isSelected,
  name,
  lock,
  draggable,
  height,
  width,
  ...props
}: {
  // onDragStart: (shape: Konva.ShapeConfig) => void;
  onDragEnd: (e: any) => void;
  onTransform: (e: any) => void;
  onClick: (e: any) => void;
  isSelected: boolean;
  [key: string]: any;
}) => {
  const rootGroupRef = useRef<Konva.Group | any>();
  const transformerRef = useRef<Konva.Transformer | any>();
  const mapCallBack = ({ type, ...rest }: any, index: number) =>
    type === "group"
      ? ((
          { descendants, globalCompositeOperation, ...groupProps }: any,
          x: number = 0,
          y: number = 0
        ) => (
          <Group
            key={index}
            globalCompositeOperation={globalCompositeOperation}
            {...groupProps}
            {...{ x, y }}
          >
            {descendants.map(mapCallBack)}
          </Group>
        ))(rest)
      : (({ d, ...pathProps }: any, x: number = 0, y: number = 0) => (
          <Path
            key={index}
            data={svgpath(d).scale(2).toString()}
            {...pathProps}
            {...{ x, y }}
          />
        ))(rest);

  useTransformer({
    isSelected,
    ref: rootGroupRef,
    transformer: transformerRef,
  });

  useEffect(() => {
    if (transformerRef.current)
      transformerRef.current.findOne(".rotater").on("mouseenter", () => {
        transformerRef.current.getStage().content.style.cursor = `url("data:image/svg+xml,%3Csvg%20width%3D%2720%27%20height%3D%2720%27%20viewBox%3D%270%200%2020%2020%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cpath%20d%3D%27M11.8597%2017.3593L11.652%2017.395V17.6057V19.5921L5.12661%2016.2681L11.652%2012.9441V14.7281V15.0506L11.9643%2014.9702C14.9074%2014.2131%2017.0994%2011.7875%2017.0994%208.88374C17.0994%205.36349%2013.8862%202.54885%2010%202.54885C6.11384%202.54885%202.9006%205.36349%202.9006%208.88374C2.9006%209.73835%203.08658%2010.5636%203.45294%2011.3393L1.06179%2012.3371C0.52252%2011.2457%200.25%2010.0857%200.25%208.88383C0.250101%204.15038%204.59557%200.25%2010.0001%200.25C15.4046%200.25%2019.75%204.15038%2019.75%208.88383C19.75%2013.0601%2016.3711%2016.5844%2011.8597%2017.3593Z%27%20fill%3D%27%23fff%27%20stroke%3D%27%23000%27%20stroke-width%3D%270.5%27%2F%3E%3C%2Fsvg%3E") 10 10, auto`;
      });
  }, [transformerRef]);

  return (
    <Fragment>
      <Group
        ref={rootGroupRef}
        {...props}
        name={name}
        draggable={!lock ? draggable : false}
        width={width}
        height={height}
        offsetX={width / 2}
        offsetY={height / 2}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        onTransformEnd={(e) => {
          const node = rootGroupRef.current;
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
            // width: node.width() * scaleX,
            // height: node.height() * scaleY,
          });
        }}
      >
        {props.data.map(mapCallBack)}
      </Group>
      {isSelected && (
        <Portal selector=".top-layer" enabled={isSelected}>
          <Transformer
            ref={transformerRef}
            borderStroke={"#129FEE"}
            borderStrokeWidth={2}
            anchorStroke={"#129FEE"}
            anchorStrokeWidth={1.5}
            anchorSize={9}
            anchorCornerRadius={0}
            rotateEnabled={!lock}
            rotateAnchorOffset={30}
            rotationSnaps={Array(4)
              .fill(0)
              .map((_, i) => i * 90)}
            rotationSnapTolerance={10}
            enabledAnchors={
              !lock
                ? ["top-left", "top-right", "bottom-right", "bottom-left"]
                : []
            }
          />
        </Portal>
      )}
    </Fragment>
  );
};
