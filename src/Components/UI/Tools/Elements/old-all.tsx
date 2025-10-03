import { Fragment } from "react";

import SomeSVGShapes from "./some-svg-shapes";

const OldAllElements = ({ toggleView }: any) => {
  return (
    <Fragment>
      <SomeSVGShapes toggleView={toggleView} />
    </Fragment>
  );
};

export default OldAllElements;
