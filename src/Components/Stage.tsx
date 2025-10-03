/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Konva from "konva";
import { Stage, Layer, Image, Rect } from "react-konva";
import useImage from "use-image";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";
import { useMultiSelect } from "Hooks/useMultiSelect";
import {
  CropableImage,
  EditableText,
  TransformableSinglePath,
  TransformableSVG,
  ClippedImage,
  MultiSelect,
} from "Components/UI/Elements";

Konva.pixelRatio = 1;

const CanvasStage = () => {
  const {
    canvas,
    containerRef,
    setCurrentColor,
    toggleEditSelected,
    setEditTool,
    editText,
    toggleEditText,
    stageRef,
  } = useAppState();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<Konva.Layer | any>();
  const {
    setSelected,
    updateElement,
    elements,
    selected,
    unFocus,
    setFocused,
    zoom,
    setZoom,
    loadingTemplate,
    templateImage,
    draggable,
    stage,
    setStage,
    layer,
    setLayer,
  } = useElementsContext();
  const {
    msProps,
    msClick,
    msDraggable,
    msDragMove,
    msDragEnd,
    msSelectionRectStart,
    msSelectionRectMove,
    msSelectionRectEnd,
    msMouseDown,
  } = useMultiSelect(stageRef.current);
  const [loadingTemplateImage] = useImage(templateImage, "anonymous");

  useEffect(() => {
    if (loadingTemplate && loadingTemplateImage) {
      const loadingImg = stage.findOne(
        (node: any) => node.id() === "template-loading"
      );
      loadingImg.cache();
    }
  }, [loadingTemplate, loadingTemplateImage]);

  useEffect(() => {
    if (stageRef.current && !stage) {
      setStage(stageRef.current);
    }
    if (layerRef.current && !layer) {
      setLayer(layerRef.current);
    }
  }, [stageRef, layerRef]);

  useEffect(() => {
    if (containerRef.current && wrapperRef.current) {
      const { current: containerEl } = containerRef;
      const { current: stageEl } = wrapperRef;
      containerEl.scrollTop =
        Math.abs(stageEl.clientHeight - containerEl.clientHeight) / 2;
      containerEl.scrollLeft =
        Math.abs(stageEl.clientWidth - containerEl.clientWidth) / 2;
    }
  }, [zoom]);

  useEffect(() => {
    const { current: containerEl } = containerRef;
    const maxSide = Math.max(canvas.height, canvas.width);
    const minContainerSide = Math.min(
      containerEl.clientHeight,
      containerEl.clientWidth
    );
    setZoom(Math.ceil((minContainerSide / maxSide) * 100) - 5);
  }, []);

  return (
    <Box
      display="flex"
      flex={1}
      gridArea="canvas"
      position="relative"
      zIndex={0}
      m="auto"
      onClick={(e: any) => {
        if (!wrapperRef.current?.contains(e.target)) {
          setSelected(null);
          setFocused(null);
          setCurrentColor("");
          setEditTool("");
          toggleEditSelected(false);
        }
      }}
    >
      <Box
        ref={wrapperRef}
        display="flex"
        flexDirection="row"
        flexShrink={0}
        justifyContent="center"
        position="relative"
        margin="auto"
      >
        <Box
          display="flex"
          flexDirection="column"
          position="relative"
          style={{
            transform: `scale(${zoom / 100})`,
            ...(loadingTemplate ? { cursor: "wait" } : {}),
          }}
        >
          <Stage
            ref={stageRef}
            width={canvas.width}
            height={canvas.height}
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.25)",
            }}
            // width={(canvas.width * zoom) / 100}
            // height={(canvas.height * zoom) / 100}
            // scaleX={zoom / 100}
            // scaleY={zoom / 100}
            onMouseDown={(e) => {
              if (e === undefined) {
                setSelected(null);
                setFocused(null);
                setCurrentColor("");
                setEditTool("");
                toggleEditSelected(false);
                return;
              }
              const emptyClicked = e.target === e.target.getStage();
              if (emptyClicked) {
                msMouseDown()();
                setSelected(null);
                setFocused(null);
                setCurrentColor("");
                setEditTool("");
                toggleEditSelected(false);
              }
              unFocus();
            }}
            onMouseMove={(e) => {
              if (e.evt.buttons === 1) msSelectionRectMove(e.target.getStage());
            }}
            onMouseUp={() => {
              msSelectionRectEnd();
            }}
            onTouchStart={(e) => {
              if (e === undefined) {
                setSelected(null);
                setFocused(null);
                setCurrentColor("");
                setEditTool("");
                toggleEditSelected(false);
                return;
              }
              const emptyClicked = e.target === e.target.getStage();
              if (emptyClicked) {
                msSelectionRectStart(e.target.getStage());
                setSelected(null);
                setFocused(null);
                setCurrentColor("");
                setEditTool("");
                toggleEditSelected(false);
              }
            }}
            onTouchMove={(e) => {
              msSelectionRectMove(e.target.getStage());
            }}
            onTouchEnd={() => {
              msSelectionRectEnd();
            }}
          >
            <Layer ref={layerRef}>
              <MultiSelect {...msProps} />
              {elements.map((element, index) => {
                switch (element.type) {
                  case "path":
                    return (
                      <TransformableSinglePath
                        {...element}
                        draggable={draggable && msDraggable(element.id)}
                        key={element.id}
                        id={element.id}
                        isSelected={selected === element.id}
                        onClick={msClick(element)}
                        onMouseDown={msMouseDown(element)}
                        onDragMove={msDragMove(element)}
                        onDragEnd={msDragEnd(element)}
                        onTransform={(updated) =>
                          updateElement({
                            ...updated,
                            id: element.id,
                          })
                        }
                      />
                    );
                  case "flat-svg":
                    return (
                      <TransformableSVG
                        {...element}
                        draggable={draggable}
                        key={element.id}
                        isSelected={selected === element.id}
                        onClick={msClick(element)}
                        onMouseDown={msMouseDown(element)}
                        onDragMove={msDragMove(element)}
                        onDragEnd={msDragEnd(element)}
                        onTransform={(updated) =>
                          updateElement({
                            ...updated,
                            id: element.id,
                          })
                        }
                      />
                    );
                  case "image":
                    return (
                      <CropableImage
                        state={element}
                        setState={(state: any) => {
                          updateElement({ ...element, ...state });
                        }}
                        isSelected={selected === element.id}
                        onClick={msClick(element)}
                        onMouseDown={msMouseDown(element)}
                        onDragMove={msDragMove(element)}
                        onDragEnd={msDragEnd(element)}
                        key={element.id}
                      />
                    );
                  case "text":
                    return (
                      <EditableText
                        {...element}
                        draggable={draggable}
                        id={element.id}
                        key={element.id}
                        text={element.text}
                        stage={stageRef.current}
                        canvasWidth={canvas.width}
                        canvasHeight={canvas.height}
                        isSelected={selected === element.id}
                        onClick={msClick(element)}
                        onMouseDown={msMouseDown(element)}
                        onDragMove={msDragMove(element)}
                        onDragEnd={msDragEnd(element)}
                        toggleEditText={toggleEditText}
                        editText={editText}
                        onTransform={(updated: any) => {
                          updateElement(
                            {
                              id: element.id,
                              ...updated,
                            },
                            { saveHistory: false }
                          );
                        }}
                        onTransformEnd={(updated: any) => {
                          updateElement({
                            id: element.id,
                            ...updated,
                          });
                        }}
                      />
                    );
                  case "clippedImage":
                    return (
                      <ClippedImage
                        state={element}
                        setState={(state: any) => {
                          updateElement({ ...element, ...state });
                        }}
                        isSelected={selected === element.id}
                        onClick={msClick(element)}
                        onMouseDown={msMouseDown(element)}
                        onDragMove={msDragMove(element)}
                        onDragEnd={msDragEnd(element)}
                        key={element.id}
                      />
                    );
                  default:
                    return null;
                }
              })}
              <Rect id="selectionRect" visible={false} stroke="blue" />
              {loadingTemplate && loadingTemplateImage && (
                <Image
                  id={`template-loading`}
                  image={loadingTemplateImage}
                  filters={[Konva.Filters.Blur]}
                  blurRadius={10}
                  x={0}
                  y={0}
                  height={canvas.height * 1.01}
                  width={canvas.width * 1.01}
                />
              )}
            </Layer>
          </Stage>
        </Box>
      </Box>
    </Box>
  );
};

export default CanvasStage;
