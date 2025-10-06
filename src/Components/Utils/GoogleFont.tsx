/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { GoogleFont as GoogleFontType, GoogleFontProps } from "Interfaces";

const createLink = (fonts: GoogleFontType[], subsets: string[] | undefined, display: string | undefined) => {
  const families = fonts
    .reduce((acc: string[], font: GoogleFontType) => {
      const family = font.font.replace(/ +/g, "+");
      const weights = (font.weights || []).join(",");

      return [...acc, family + (weights && `:${weights}`)];
    }, [])
    .join("|");

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css?family=${families}`;

  if (subsets && Array.isArray(subsets) && subsets.length > 0) {
    link.href += `&subset=${subsets.join(",")}`;
  }

  if (display) {
    link.href += `&display=${display}`;
  }

  return link;
};

const GoogleFont = ({ fonts, subsets, display = "swap", onLoad }: GoogleFontProps) => {
  const [link, setLink] = useState(createLink(fonts, subsets, display));

  useEffect(() => {
    document.head.appendChild(link);

    link &&
      link.addEventListener("load", () => {
        onLoad && onLoad();
      });

    return () => {
      document.head.removeChild(link);
    };
  }, [link]);

  useEffect(() => {
    setLink(createLink(fonts, subsets, display));
  }, [fonts, subsets, display]);

  return null;
};

export default GoogleFont;
