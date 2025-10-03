import SVGColor from "./SVG/Color";

const EditFlatSVG = ({ tool }: { tool: string }) => {
  return ((tool) => {
    switch (tool) {
      case "color":
        return <SVGColor />;
      default:
        return null;
    }
  })(tool);
};

export default EditFlatSVG;
