import ShapeColor from "./Shape/Color";
import ShapeClip from "./Shape/Clip";
import ShapeShadow from "./Shape/Shadow";
import ShapeStroke from "./Shape/Stroke";

const EditShape = ({ tool }: { tool: string }) =>
  ((tool) => {
    switch (tool) {
      case "color":
        return <ShapeColor />;
      case "stroke":
        return <ShapeStroke />;
      case "clip":
        return <ShapeClip />;
      case "shadow":
        return <ShapeShadow />;
      default:
        return null;
    }
  })(tool);

export default EditShape;
