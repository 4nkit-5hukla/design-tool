/* eslint-disable react-hooks/exhaustive-deps */
import { Fragment, MouseEvent, useEffect, useState } from "react";
import { Box, Button, ToggleButton, Tooltip } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

import { useAppState } from "Contexts/AppState";
import { useElementsContext } from "Contexts/Elements";

import {
  ImageEdit,
  ImageCrop,
  Flip,
  ImagePosition,
  ImageTransparency,
  ImageLock,
  ImageDuplicate,
  ImageDelete,
  TextAlignCenter,
  TextAlignJustify,
  TextAlignLeft,
  TextAlignRight,
  TextBullets,
  TextNumbers,
  TextLineHeight,
  TextShadow,
  TextTranslate,
  Check,
  Cross,
  ShapeOutline,
  Shadow,
  Clip,
} from "Assets/Icons";
import { useMultiSelect } from "Hooks/useMultiSelect";
import { useDebounce, useId, } from "Hooks";

import ImageFlipper from "./TopTools/ImageFlipper";
import TextStyler from "./TopTools/TextStyler";
import TextAdjustment from "./TopTools/TextAdjustment";
import ElementPositioner from "./TopTools/ElementPositioner";
import ElementOpacity from "./TopTools/ElementOpacity";
import ShapeStroke from "./TopTools/ShapeStroke";
import TextAlignment from "./TopTools/TextAlignment";
import NumberField from "../Fields/NumberField";
import { useHistory } from "Contexts/History";

const ToolBarTop = () => {
  const isMac =
    typeof window !== "undefined" ? navigator.userAgent.includes("Mac") : false;
  const {
    toggleEditSelected,
    editTool,
    setEditTool,
    currentColor,
    setCurrentColor,
    toggleEditText,
    multiSelectIds,
    setMultiSelectIds,
    avgMoveUnit,
  } = useAppState();
  const {
    elements,
    setElements,
    updateElement,
    updateElements,
    duplicateElement,
    removeElement,
    selected,
    setSelected,
    selectedEl,
    unSelect,
    unFocus,
    toggleUsingTool,
  } = useElementsContext();
  const [flipEl, setFlipEl] = useState<null | HTMLElement>(null);
  const [shapeOutlineEl, setShapeOutlineEl] = useState<null | HTMLElement>(
    null
  );
  const [textStyleEl, setTextStyleEl] = useState<null | HTMLElement>(null);
  const [textAdjustmentEl, setTextAdjustmentEl] = useState<null | HTMLElement>(
    null
  );
  const [textTransform, setTextTransform] = useState<number>(-1);
  const [textAlign, setTextAlign] = useState<string>("left");
  const [text, setText] = useState<string>("");
  const textDebounce = text;
  const [textAlignEl, setTextAlignEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [positionEl, setPositionEl] = useState<HTMLButtonElement | null>(null);
  const [transparencyEl, setTransparencyEl] =
    useState<HTMLButtonElement | null>(null);
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [fontSize, setFontSize] = useState<number>(100);
  const fontSizeDebounce = useDebounce(fontSize, 200);
  const [fontColor, setFontColor] = useState<string>("#000000");
  const { generateId } = useId();
  const { msProps, msGroupClick, msGrouped } = useMultiSelect();
  const { saveHistory } = useHistory();
  const openFlip = (event: MouseEvent<HTMLButtonElement>) => {
    setFlipEl(event.currentTarget);
    toggleUsingTool(true);
  };
  const openShapeOutline = (event: MouseEvent<HTMLButtonElement>) => {
    setShapeOutlineEl(event.currentTarget);
    toggleUsingTool(true);
  };
  const openTextStyle = (event: MouseEvent<HTMLButtonElement>) => {
    setTextStyleEl(event.currentTarget);
    toggleUsingTool(true);
  };
  const openTextAdjustment = (event: MouseEvent<HTMLButtonElement>) => {
    setTextAdjustmentEl(event.currentTarget);
    toggleUsingTool(true);
  };
  const openTextAlignment = (event: MouseEvent<HTMLButtonElement>) => {
    setTextAlignEl(event.currentTarget);
    toggleUsingTool(true);
  };
  const openPosition = (event: MouseEvent<HTMLButtonElement>) => {
    setPositionEl(event.currentTarget);
    toggleUsingTool(true);
  };
  const openTransparency = (event: MouseEvent<HTMLButtonElement>) => {
    setTransparencyEl(event.currentTarget);
    toggleUsingTool(true);
  };
  const closeFlip = () => {
    setFlipEl(null);
    toggleUsingTool(false);
  };
  const closeShapeOutline = () => {
    const id = selectedEl.id;
    setShapeOutlineEl(null);
    toggleUsingTool(false);
    unSelect();
    setTimeout(() => setSelected(id), 0);
  };
  const closeTextStyle = () => {
    setTextStyleEl(null);
    toggleUsingTool(false);
  };
  const closeTextAdjustment = () => {
    setTextAdjustmentEl(null);
    toggleUsingTool(false);
  };
  const closeTextAlign = () => {
    setTextAlignEl(null);
    toggleUsingTool(false);
  };
  const closePosition = () => {
    setPositionEl(null);
    toggleUsingTool(false);
  };
  const closeTransparency = () => {
    setTransparencyEl(null);
    toggleUsingTool(false);
  };
  const editSelectedElement = () => {
    toggleEditSelected((editSelected: boolean) => !editSelected);
  };
  const editTextTool = (tool: string) => {
    toggleEditText(false);
    toggleEditSelected((editSelected: boolean) =>
      editTool !== tool && editSelected ? editSelected : !editSelected
    );
    setEditTool((pervTool: any) => (pervTool !== tool ? tool : ""));
  };
  const editSVGTool = (tool: string, color: string) => {
    toggleEditSelected(true);
    setEditTool((pervTool: any) => (pervTool !== tool ? tool : pervTool));
    setCurrentColor((currentColor: string) =>
      currentColor !== color ? color : currentColor
    );
  };
  const editShapeTool = (tool: string, color: string) => {
    toggleEditSelected(true);
    setEditTool((pervTool: any) => (pervTool !== tool ? tool : pervTool));
    setCurrentColor((currentColor: string) =>
      currentColor !== color ? color : currentColor
    );
  };
  const saveFontSize = () => {
    if (selectedEl) {
      if (!selectedEl.lock && selectedEl.fontSize !== fontSize) {
        updateElement({
          id: selectedEl.id,
          fontSize,
        });
      }
    }
  };
  const saveText = () => {
    if (selectedEl) {
      if (!selectedEl.lock) {
        if (selectedEl.text !== textDebounce) {
          updateElement({
            id: selectedEl.id,
            text: textDebounce,
          });
        }
        if (textAlign && selectedEl.align !== textAlign) {
          updateElement({
            id: selectedEl.id,
            align: textAlign,
          });
        }
      }
    }
  };
  const doTextTransform = () => {
    const uCF = (text: string) =>
      text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    const transformCases = ["capitalize", "lower", "sentence", "upper"];
    switch (transformCases[textTransform]) {
      case "capitalize":
        setText(
          selectedEl.text
            .split(" ")
            .map((w: string) => uCF(w))
            .join(" ")
        );
        break;
      case "lower":
        setText(selectedEl.text.toLowerCase());
        break;
      case "sentence":
        setText(
          selectedEl.text
            .split(". ")
            .map((s: string) => uCF(s))
            .join(". ")
        );
        break;
      case "upper":
        setText(selectedEl.text.toUpperCase());
        break;
      default:
    }
  };
  const applyList = (text: string) =>
    text
      .split("\n")
      .map((line: string, index: number) => {
        if (line.includes(`• `)) {
          return line.replace(`• `, `${index + 1}. `);
        } else if (line.includes(`${index + 1}. `)) {
          return line.replace(`${index + 1}. `, ``);
        } else {
          return `• ${line}`;
        }
      })
      .join("\n");
  const toggleBulletsAndNumbers = () => {
    if (selectedEl) {
      if (!selectedEl.useList) {
        updateElement({
          id: selectedEl.id,
          useList: true,
          listType: "ul",
          text: applyList(selectedEl.text),
        });
      } else if (selectedEl.useList && selectedEl.listType === "ul") {
        updateElement({
          id: selectedEl.id,
          listType: "ol",
          text: applyList(selectedEl.text),
        });
      } else if (selectedEl.useList && selectedEl.listType === "ol") {
        updateElement({
          id: selectedEl.id,
          useList: false,
          listType: "",
          text: applyList(selectedEl.text),
        });
      }
    }
  };
  const lockToggleElement = () => {
    if (multiSelectIds.size > 0) {
      updateElements(
        elements.map((e) => ({
          ...e,
          id: e.id as string,
          lock: multiSelectIds.has(e.id) ? !msProps.lock : e.lock,
        }))
      );
      return;
    }
    updateElement({
      id: selectedEl.id,
      lock: !selectedEl.lock,
    });
  };
  const doDuplicateElement = () => {
    if (selectedEl) {
      const element = duplicateElement(selectedEl.id, avgMoveUnit);
      setSelected(element.id);
    }
    if (multiSelectIds.size > 0) {
      const groupIds: Map<string, string> = new Map();
      const duplicate = (id: unknown, index: number, array: unknown[]) => {
        const element: any = elements.find((item) => item.id === id);
        const newId = generateId();
        groupIds.set(id as string, newId);
        const created = {
          ...element,
          id: newId,
          x: element.x + 10,
          y: element.y + 10,
        };
        if (element.type === "clippedImage") {
          created.shapeX += 10;
          created.shapeY += 10;
        }
        return created;
      };
      const created = Array.from(multiSelectIds).map(duplicate);
      created.forEach((e) => {
        if (!e.group) return [];
        e.group = e.group.map((id: string) => groupIds.get(id));
      });
      const result = elements.concat(created);
      setElements(result);
      saveHistory(result);
      setMultiSelectIds(new Set(created.map(({ id }) => id)));
    }
  };
  const deleteElement = () => {
    if (selected) {
      removeElement(selected);
      unSelect();
      unFocus();
    }
    if (multiSelectIds.size > 0) {
      updateElements(elements.filter((e) => !multiSelectIds.has(e.id)));
      setMultiSelectIds(new Set());
    }
  };

  useEffect(() => {
    saveFontSize();
  }, [fontSizeDebounce]);

  useEffect(() => {
    doTextTransform();
  }, [textTransform]);

  useEffect(() => {
    saveText();
  }, [textDebounce, textAlign]);

  useEffect(() => {
    if (selectedEl) {
      if (selectedEl.text) {
        setText(selectedEl.text);
      }
      if (selectedEl.align) {
        setTextAlign(selectedEl.align);
      }
      if (selectedEl.fill) {
        setFontColor(selectedEl.fill);
      }
      if (selectedEl.fontFamily) {
        setFontFamily(selectedEl.fontFamily);
      }
      if (selectedEl.fontSize) {
        setFontSize(selectedEl.fontSize);
      }
    }
  }, [selectedEl]);

  return (
    <Fragment>
      <Box
        flexShrink={0}
        boxShadow="0px 0px 20px rgba(0, 0, 0, 0.25)"
        position="relative"
      >
        <Box
          sx={{
            WebkitTapHighlightColor: "transparent",
            outline: "none",
          }}
        >
          <Box
            alignItems="center"
            bgcolor="#FFFFFF"
            columnGap="20px"
            display="flex"
            height={48}
            justifyContent="space-between"
            paddingY={1}
            paddingX={2.5}
            width="100%"
          >
            <Box
              alignItems="center"
              columnGap={0.875}
              display="flex"
              height={"100%"}
            >
              {selectedEl &&
                (() => {
                  switch (selectedEl.type) {
                    case "image":
                      return (
                        <Fragment>
                          <Box
                            borderRadius={0}
                            columnGap={"5px"}
                            component={Button}
                            height="100%"
                            paddingY={0}
                            paddingX={1}
                            justifyContent="space-between"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            onClick={editSelectedElement}
                          >
                            <ImageEdit />
                            <Box
                              component="span"
                              color="#24272C"
                              fontWeight={400}
                              fontSize={14}
                              lineHeight="16px"
                            >
                              {"Edit"}
                            </Box>
                          </Box>
                          <Box
                            borderRadius={0}
                            columnGap={"5px"}
                            component={Button}
                            height="100%"
                            paddingY={0}
                            paddingX={1}
                            justifyContent="space-between"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            onClick={() => {
                              updateElement(
                                {
                                  id: selectedEl.id,
                                  isCropping: true,
                                  isCropped: false,
                                },
                                { saveHistory: false }
                              );
                            }}
                          >
                            <ImageCrop />
                            <Box
                              component="span"
                              color="#24272C"
                              fontWeight={400}
                              fontSize={14}
                              lineHeight="16px"
                            >
                              {"Crop"}
                            </Box>
                          </Box>
                          <Box
                            borderRadius={0}
                            columnGap={"5px"}
                            component={Button}
                            height="100%"
                            paddingY={0}
                            paddingX={1}
                            justifyContent="space-between"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            onClick={openFlip}
                          >
                            <Flip />
                            <Box
                              component="span"
                              color="#24272C"
                              fontWeight={400}
                              fontSize={14}
                              lineHeight="16px"
                            >
                              {"Flip"}
                            </Box>
                          </Box>
                        </Fragment>
                      );
                    case "text":
                      return (
                        <Fragment>
                          <Box
                            border={"1px solid #24272C4D"}
                            borderRadius={0.375}
                            columnGap={0.625}
                            component={ToggleButton}
                            height="100%"
                            paddingY={1}
                            paddingLeft={1.25}
                            paddingRight={0.375}
                            justifyContent="space-between"
                            value="text-bullet"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            selected={editTool === "fontFamily"}
                            onClick={() => {
                              editTextTool("fontFamily");
                            }}
                            minWidth={172}
                            fontWeight={600}
                            fontSize={14}
                            lineHeight="16px"
                            color="#24272C"
                          >
                            {fontFamily}
                            <ExpandMore />
                          </Box>
                          <NumberField
                            value={parseFloat(fontSize.toFixed(2))}
                            setValue={setFontSize}
                            min={5}
                            max={300}
                            step={1}
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            editableInput={true}
                          />
                          <Box
                            border="none"
                            borderRadius={0.625}
                            columnGap={"5px"}
                            component={ToggleButton}
                            paddingY={0}
                            paddingX={0}
                            justifyContent="center"
                            value="color"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            onClick={() => {
                              editTextTool("textColor");
                            }}
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="//www.w3.org/2000/svg"
                            >
                              <path
                                d="M5 0.5H19C21.4853 0.5 23.5 2.51472 23.5 5V19C23.5 21.4853 21.4853 23.5 19 23.5H5C2.51472 23.5 0.5 21.4853 0.5 19V5C0.5 2.51472 2.51472 0.5 5 0.5Z"
                                fill={fontColor}
                                stroke="#99999980"
                                strokeWidth={1}
                              />
                            </svg>
                          </Box>
                          <Box
                            borderRadius={0}
                            columnGap={"5px"}
                            component={Button}
                            height="100%"
                            paddingY={0}
                            paddingX={1}
                            justifyContent="center"
                            minWidth="37px"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            onClick={openTextStyle}
                          >
                            <Box
                              component="span"
                              color="#24272CB3"
                              fontWeight={900}
                              fontSize={24}
                              lineHeight="28px"
                            >
                              {"B"}
                            </Box>
                          </Box>
                          <Box
                            borderRadius={0}
                            columnGap={"5px"}
                            component={Button}
                            height="100%"
                            paddingY={0}
                            paddingX={0}
                            justifyContent="center"
                            minWidth="37px"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            onClick={() =>
                              setTextTransform((textTransform) =>
                                textTransform > -1
                                  ? textTransform < 3
                                    ? textTransform + 1
                                    : 0
                                  : 0
                              )
                            }
                          >
                            <Box
                              component="span"
                              color="#24272CB3"
                              fontWeight={400}
                              fontSize={24}
                              lineHeight="28px"
                              textTransform="initial"
                            >
                              {"aA"}
                            </Box>
                          </Box>
                          <Box
                            borderRadius={0}
                            columnGap={"5px"}
                            component={Button}
                            height="100%"
                            paddingY={1}
                            paddingX={1 + 0.75 / 4}
                            justifyContent="center"
                            minWidth="unset"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            onClick={openTextAlignment}
                          >
                            {((textAlign) =>
                              ({
                                center: <TextAlignCenter />,
                                right: <TextAlignRight />,
                                justify: <TextAlignJustify />,
                                left: <TextAlignLeft />,
                              }[textAlign]))(textAlign)}
                          </Box>
                          <Box
                            border={"none"}
                            borderRadius={0}
                            columnGap={"5px"}
                            component={ToggleButton}
                            height="100%"
                            paddingY={1}
                            paddingX={1 + 0.75 / 4}
                            justifyContent="center"
                            value="text-bullet"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            selected={selectedEl ? selectedEl.useList : false}
                            onClick={toggleBulletsAndNumbers}
                            minWidth="unset"
                          >
                            {selectedEl && selectedEl.listType === "ol" ? (
                              <TextNumbers />
                            ) : (
                              <TextBullets />
                            )}
                          </Box>
                          <Box
                            borderRadius={0}
                            columnGap={"5px"}
                            component={Button}
                            height="100%"
                            paddingY={1}
                            paddingX={1 + 0.25 / 4}
                            justifyContent="center"
                            minWidth="unset"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            onClick={openTextAdjustment}
                          >
                            <TextLineHeight />
                          </Box>
                          <Box
                            border={"none"}
                            borderRadius={0}
                            columnGap={"5px"}
                            component={ToggleButton}
                            height="100%"
                            paddingY={1}
                            paddingX={1.25}
                            justifyContent="center"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            value="textShadow"
                            selected={editTool === "textShadow"}
                            onClick={() => {
                              editTextTool("textShadow");
                            }}
                            minWidth="unset"
                          >
                            <TextShadow />
                          </Box>
                          <Box
                            borderRadius={0}
                            columnGap={"5px"}
                            component={Button}
                            height="100%"
                            paddingY={1}
                            paddingX={1.25}
                            justifyContent="center"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            minWidth="unset"
                          >
                            <TextTranslate />
                          </Box>
                        </Fragment>
                      );
                    case "flat-svg":
                      return (
                        <Fragment>
                          <Box
                            borderRadius={0}
                            columnGap={"5px"}
                            component={Button}
                            height="100%"
                            paddingY={0}
                            paddingX={1}
                            justifyContent="space-between"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            onClick={openFlip}
                          >
                            <Flip />
                            <Box
                              component="span"
                              color="#24272C"
                              fontWeight={400}
                              fontSize={14}
                              lineHeight="16px"
                            >
                              {"Flip"}
                            </Box>
                          </Box>
                          {selectedEl.colors.map(
                            (color: string, index: number) => (
                              <Box
                                border="none"
                                borderRadius={0.625}
                                columnGap={"5px"}
                                component={ToggleButton}
                                paddingY={0}
                                paddingX={0}
                                justifyContent="center"
                                value="color"
                                selected={currentColor === color}
                                key={index}
                                disabled={
                                  selectedEl ? selectedEl.lock : msProps.lock
                                }
                                onClick={() => {
                                  editSVGTool("color", color);
                                }}
                                sx={{
                                  "&.Mui-selected": {
                                    boxShadow:
                                      "0 0 1px 2px #eef5f9, 0 0 1px 4px #12b0ee",
                                  },
                                }}
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="//www.w3.org/2000/svg"
                                >
                                  <rect
                                    width="24"
                                    height="24"
                                    rx="5"
                                    fill={color}
                                    stroke="#99999980"
                                    strokeWidth={1}
                                  />
                                </svg>
                              </Box>
                            )
                          )}
                        </Fragment>
                      );
                    case "path":
                    case "circle":
                    case "ellipse":
                    case "rectangle":
                    case "rect":
                    case "clippedImage":
                      return (
                        <Fragment>
                          <Box
                            borderRadius={0}
                            columnGap={"5px"}
                            component={Button}
                            height="100%"
                            paddingY={0}
                            paddingX={1}
                            justifyContent="space-between"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            onClick={openFlip}
                          >
                            <Flip />
                            <Box
                              component="span"
                              color="#24272C"
                              fontWeight={400}
                              fontSize={14}
                              lineHeight="16px"
                            >
                              {"Flip"}
                            </Box>
                          </Box>
                          <Box
                            border={"none"}
                            borderRadius={0}
                            component={ToggleButton}
                            color="primary"
                            height="100%"
                            paddingY={1}
                            paddingX={1.25}
                            justifyContent="center"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            value="clip"
                            selected={editTool === "clip"}
                            onClick={() => {
                              if (selectedEl.type === "clippedImage") {
                                updateElement({
                                  ...selectedEl,
                                  isClipping: true,
                                });
                                return;
                              }
                              toggleEditSelected(
                                (editSelected: boolean) => !editSelected
                              );
                              setEditTool((pervTool: any) =>
                                pervTool !== "clip" ? "clip" : ""
                              );
                            }}
                            minWidth="unset"
                            sx={{
                              color: "#12B0EE",

                              "&:hover": {
                                backgroundColor: "rgba(18, 176, 238, 0.04)",
                              },
                            }}
                          >
                            <Clip />
                            <Box
                              component="span"
                              color="#24272C"
                              fontWeight={400}
                              fontSize={14}
                              lineHeight="16px"
                            >
                              {"Clip"}
                            </Box>
                          </Box>
                          <Box
                            border={"none"}
                            borderRadius={0}
                            component={ToggleButton}
                            color="primary"
                            height="100%"
                            paddingY={1}
                            paddingX={1.25}
                            justifyContent="center"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            value="shadow"
                            selected={editTool === "shadow"}
                            onClick={() => {
                              toggleEditSelected(
                                (editSelected: boolean) => !editSelected
                              );
                              setEditTool((pervTool: any) =>
                                pervTool !== "shadow" ? "shadow" : ""
                              );
                            }}
                            minWidth="unset"
                            sx={{
                              color: "#12B0EE",

                              "&:hover": {
                                backgroundColor: "rgba(18, 176, 238, 0.04)",
                              },
                            }}
                          >
                            <Shadow />
                            <Box
                              component="span"
                              color="#24272C"
                              fontWeight={400}
                              fontSize={14}
                              lineHeight="16px"
                            >
                              {"Shadow"}
                            </Box>
                          </Box>
                          <Box
                            borderRadius={0}
                            columnGap={"5px"}
                            component={Button}
                            height="100%"
                            paddingY={0}
                            paddingX={1}
                            justifyContent="space-between"
                            disabled={
                              selectedEl ? selectedEl.lock : msProps.lock
                            }
                            onClick={openShapeOutline}
                          >
                            <ShapeOutline />
                            <Box
                              component="span"
                              color="#24272C"
                              fontWeight={400}
                              fontSize={14}
                              lineHeight="16px"
                            >
                              {"Outline"}
                            </Box>
                          </Box>
                          {selectedEl.strokeWidth > 0 && (
                            <Box
                              border="none"
                              borderRadius={0.625}
                              component={ToggleButton}
                              paddingY={0}
                              paddingX={0}
                              justifyContent="center"
                              value="color"
                              selected={currentColor === selectedEl.stroke}
                              onClick={() => {
                                editShapeTool("stroke", selectedEl.stroke);
                              }}
                              sx={{
                                "&.Mui-disabled": {
                                  border: "none",
                                },

                                "&.Mui-selected": {
                                  boxShadow:
                                    "0 0 1px 2px #eef5f9, 0 0 1px 4px #12b0ee",
                                },
                              }}
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="//www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M19 4H5C4.44771 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V5C20 4.44771 19.5523 4 19 4ZM5 0C2.23858 0 0 2.23858 0 5V19C0 21.7614 2.23858 24 5 24H19C21.7614 24 24 21.7614 24 19V5C24 2.23858 21.7614 0 19 0H5Z"
                                  fill={selectedEl.stroke}
                                />
                                <rect
                                  x="0.5"
                                  y="0.5"
                                  width="23"
                                  height="23"
                                  rx="4.5"
                                  stroke="#999999"
                                  strokeOpacity="0.5"
                                />
                                <rect
                                  x="3.5"
                                  y="3.5"
                                  width="17"
                                  height="17"
                                  rx="1.5"
                                  stroke="#999999"
                                  strokeOpacity="0.5"
                                />
                              </svg>
                            </Box>
                          )}
                          {selectedEl.type !== "clippedImage" && (
                            <Box
                              border="none"
                              borderRadius={0.625}
                              columnGap={"5px"}
                              component={ToggleButton}
                              paddingY={0}
                              paddingX={0}
                              justifyContent="center"
                              value="color"
                              selected={currentColor === selectedEl.fill}
                              disabled={
                                selectedEl ? selectedEl.lock : msProps.lock
                              }
                              onClick={() => {
                                editShapeTool("color", selectedEl.fill);
                              }}
                              sx={{
                                "&.Mui-selected": {
                                  boxShadow:
                                    "0 0 1px 2px #eef5f9, 0 0 1px 4px #12b0ee",
                                },
                              }}
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="//www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 0.5H19C21.4853 0.5 23.5 2.51472 23.5 5V19C23.5 21.4853 21.4853 23.5 19 23.5H5C2.51472 23.5 0.5 21.4853 0.5 19V5C0.5 2.51472 2.51472 0.5 5 0.5Z"
                                  fill={selectedEl.fill}
                                  stroke="#99999980"
                                  strokeWidth={1}
                                />
                              </svg>
                            </Box>
                          )}
                        </Fragment>
                      );
                    default:
                      return null;
                  }
                })()}
              {multiSelectIds.size > 0 && (
                <Fragment>
                  <Box
                    borderRadius={0}
                    columnGap={"5px"}
                    component={Button}
                    height="100%"
                    paddingY={0}
                    paddingX={1}
                    justifyContent="space-between"
                    disabled={selectedEl ? selectedEl.lock : msProps.lock}
                    onClick={msGroupClick}
                  >
                    {msGrouped ? <Cross /> : <Check />}
                    <Box
                      component="span"
                      color="#24272C"
                      fontWeight={400}
                      fontSize={14}
                      lineHeight="16px"
                    >
                      {msGrouped ? "Ungroup" : "Group"}
                    </Box>
                  </Box>
                </Fragment>
              )}
            </Box>
            {(selectedEl || msProps.visible) && (
              <Box
                alignItems="center"
                columnGap="10px"
                display="flex"
                height={"100%"}
              >
                <Box
                  borderRadius={0}
                  columnGap={"5px"}
                  component={Button}
                  padding={1}
                  justifyContent="center"
                  minWidth="unset"
                  disabled={selectedEl ? selectedEl.lock : msProps.lock}
                  onClick={openPosition}
                >
                  <ImagePosition />
                </Box>
                <Box
                  borderRadius={0}
                  columnGap={"5px"}
                  component={Button}
                  padding={1}
                  justifyContent="center"
                  minWidth="unset"
                  disabled={selectedEl ? selectedEl.lock : msProps.lock}
                  onClick={openTransparency}
                >
                  <ImageTransparency />
                </Box>
                <Tooltip title={`[${isMac ? `⌘` : `Ctrl`} + L]`}>
                  <Box>
                    <Box
                      border={"none"}
                      borderRadius={0}
                      columnGap={"5px"}
                      component={ToggleButton}
                      padding={1}
                      justifyContent={"center"}
                      minWidth={"unset"}
                      value="lock"
                      selected={selectedEl ? selectedEl.lock : msProps.lock}
                      onChange={lockToggleElement}
                      sx={{
                        color: "#12B0EE",

                        "&:hover": {
                          backgroundColor: "rgba(18, 176, 238, 0.04)",
                        },
                      }}
                    >
                      <ImageLock />
                    </Box>
                  </Box>
                </Tooltip>
                <Tooltip title={`[${isMac ? `⌘` : `Ctrl`} + D]`}>
                  <Box>
                    <Box
                      borderRadius={0}
                      columnGap={"5px"}
                      component={Button}
                      padding={1}
                      disabled={selectedEl ? selectedEl.lock : msProps.lock}
                      justifyContent="center"
                      minWidth="unset"
                      onClick={doDuplicateElement}
                    >
                      <ImageDuplicate />
                    </Box>
                  </Box>
                </Tooltip>
                <Tooltip title={isMac ? `[BKSP]` : `[DEL]`}>
                  <Box>
                    <Box
                      borderRadius={0}
                      columnGap={"5px"}
                      component={Button}
                      paddingY={1}
                      paddingX={1.25}
                      disabled={selectedEl ? selectedEl.lock : msProps.lock}
                      justifyContent="center"
                      minWidth="unset"
                      onClick={deleteElement}
                    >
                      <ImageDelete />
                    </Box>
                  </Box>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>
        {selectedEl && selectedEl.isCropping && (
          <Box
            flexShrink={0}
            zIndex={2}
            display="flex"
            columnGap={2}
            position="absolute"
            top={0}
            left={0}
            right={0}
            height="100%"
            paddingY={1}
            paddingX={2.5}
            sx={{
              backgroundColor: "#ffffff",
            }}
          >
            <Box
              borderRadius={0}
              columnGap={"5px"}
              component={Button}
              height="100%"
              paddingY={0}
              paddingX={1}
              justifyContent="space-between"
              onClick={() => {
                const id = selectedEl.id;
                updateElement({
                  id,
                  isCropping: false,
                  isCropped: true,
                  lock: selectedEl.type !== "image",
                });
                unSelect();
                setTimeout(() => setSelected(id), 10);
              }}
            >
              <Check />
              <Box
                component="span"
                color="#24272CB3"
                fontWeight={400}
                fontSize={14}
                lineHeight="16px"
              >
                {"Apply"}
              </Box>
            </Box>
            <Box
              borderRadius={0}
              columnGap={"5px"}
              component={Button}
              height="100%"
              paddingY={0}
              paddingX={1}
              justifyContent="space-between"
              onClick={() => {
                const id = selectedEl.id;
                updateElement({
                  id,
                  isCropping: false,
                  isCropped: false,
                  lock: false,
                });
                unSelect();
                setTimeout(() => setSelected(id), 10);
              }}
            >
              <Cross />
              <Box
                component="span"
                color="#24272CB3"
                fontWeight={400}
                fontSize={14}
                lineHeight="16px"
              >
                {"Cancel"}
              </Box>
            </Box>
          </Box>
        )}
        {selectedEl && selectedEl.isClipping && (
          <Box
            flexShrink={0}
            zIndex={2}
            display="flex"
            columnGap={2}
            position="absolute"
            top={0}
            left={0}
            right={0}
            height="100%"
            paddingY={1}
            paddingX={2.5}
            sx={{
              backgroundColor: "#ffffff",
            }}
          >
            <Box
              borderRadius={0}
              columnGap={"5px"}
              component={Button}
              height="100%"
              paddingY={0}
              paddingX={1}
              justifyContent="space-between"
              onClick={() => {
                const id = selectedEl.id;
                updateElement({
                  id,
                  isClipping: false,
                });
                unSelect();
                setTimeout(() => setSelected(id), 10);
              }}
            >
              <Check />
              <Box
                component="span"
                color="#24272CB3"
                fontWeight={400}
                fontSize={14}
                lineHeight="16px"
              >
                {"Apply"}
              </Box>
            </Box>
            <Box
              borderRadius={0}
              columnGap={"5px"}
              component={Button}
              height="100%"
              paddingY={0}
              paddingX={1}
              justifyContent="space-between"
              onClick={() => {
                const id = selectedEl.id;
                updateElement({
                  id,
                  isClipping: false,
                });
                unSelect();
                setTimeout(() => setSelected(id), 10);
              }}
            >
              <Cross />
              <Box
                component="span"
                color="#24272CB3"
                fontWeight={400}
                fontSize={14}
                lineHeight="16px"
              >
                {"Cancel"}
              </Box>
            </Box>
            <Box
              borderRadius={0}
              columnGap={"5px"}
              component={Button}
              height="100%"
              paddingY={0}
              paddingX={1}
              justifyContent="space-between"
              onClick={() => {
                const {
                  id,
                  shapeX,
                  shapeY,
                  shapeWidth,
                  shapeHeight,
                  rotation,
                  shapeElement,
                } = selectedEl;
                updateElement({
                  ...shapeElement,
                  x: shapeX,
                  y: shapeY,
                  rotation,
                  scaleX: shapeWidth / shapeElement.width,
                  scaleY: shapeHeight / shapeElement.height,
                  offsetX: 0,
                  offsetY: 0,
                  isClipping: false,
                });
                unSelect();
                setTimeout(() => setSelected(id), 10);
              }}
            >
              <Cross />
              <Box
                component="span"
                color="#24272CB3"
                fontWeight={400}
                fontSize={14}
                lineHeight="16px"
              >
                {"Discard"}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      <TextAlignment
        id={Boolean(textAlignEl) ? "text-alignment" : undefined}
        anchorEl={textAlignEl}
        open={Boolean(textAlignEl)}
        onClose={closeTextAlign}
      />
      <TextStyler
        anchorEl={textStyleEl}
        open={Boolean(textStyleEl)}
        onClose={closeTextStyle}
        onClick={closeTextStyle}
      />
      <TextAdjustment
        id={Boolean(transparencyEl) ? "line-text-adjustment" : undefined}
        anchorEl={textAdjustmentEl}
        open={Boolean(textAdjustmentEl)}
        onClose={closeTextAdjustment}
      />
      <ImageFlipper
        anchorEl={flipEl}
        open={Boolean(flipEl)}
        onClose={closeFlip}
        onClick={closeFlip}
      />
      <ElementPositioner
        id={Boolean(positionEl) ? "element-position" : undefined}
        anchorEl={positionEl}
        open={Boolean(positionEl)}
        onClose={closePosition}
      />
      <ElementOpacity
        id={Boolean(transparencyEl) ? "element-position" : undefined}
        anchorEl={transparencyEl}
        open={Boolean(transparencyEl)}
        onClose={closeTransparency}
        opacity={
          multiSelectIds.size > 0
            ? Math.max(
                ...(elements
                  .filter((e) => multiSelectIds.has(e.id))
                  .map((e) => e.opacity?.valueOf())
                  .filter((o) => o) as number[])
              )
            : selectedEl?.opacity
        }
      />
      <ShapeStroke
        id={Boolean(shapeOutlineEl) ? "shape-outline" : undefined}
        anchorEl={shapeOutlineEl}
        open={Boolean(shapeOutlineEl)}
        onClose={closeShapeOutline}
        strokeWidth={selectedEl?.strokeWidth}
        strokeType={selectedEl?.strokeType}
      />
    </Fragment>
  );
};

export default ToolBarTop;
