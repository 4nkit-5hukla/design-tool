import FontFamily from "./Text/FontFamily";
import TextShadow from "./Text/TextShadow";
import TextColor from "./Text/TextColor";

const EditText = ({ tool }: { tool: string }) =>
  ((tool) => {
    switch (tool) {
      case "fontFamily":
        return <FontFamily />;
      case "textColor":
        return <TextColor />;
      case "textShadow":
        return <TextShadow />;
      default:
        return null;
    }
  })(tool);

export default EditText;
