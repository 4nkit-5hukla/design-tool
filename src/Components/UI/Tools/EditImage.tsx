import { useState } from "react";

import {
  Box,
  Button,
  CardMedia,
  Collapse,
  Grid,
  Typography,
  Link,
} from "@mui/material";

import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/system";

import Blur from "./Image/Blur";
import Brightness from "./Image/Brightness";
import Contrast from "./Image/Contrast";
import Enhance from "./Image/Enhance";
import Saturation from "./Image/Saturation";
import Red from "./Image/Red";
import Green from "./Image/Green";
import Blue from "./Image/Blue";
import ImageStroke from "./Image/ImageStroke";
import ImageShadow from "./Image/ImageShadow";

const style = makeStyles((theme: Theme) => ({
  editImage: {},
}));

const EditImage = () => {
  const classes = style();
  const [showMoreAdjustments, toggleMoreAdjustments] = useState(false);
  const [showMoreFilters, toggleMoreFilters] = useState(false);

  return (
    <Box
      className={classes.editImage}
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <Box paddingX={2.5} paddingY={1.75} marginBottom={2.5}>
        <Typography
          variant="h6"
          component="h3"
          sx={{
            color: "#24272CB3",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "19px",
          }}
        >
          {"Edit Image"}
        </Typography>
      </Box>
      <Box
        flex="1 0 0"
        overflow="auto"
        paddingX={2.5}
        paddingY={1.75}
        sx={{
          "& .MuiCollapse-root.more-filters": {
            height: 0,
          },
        }}
      >
        <Box
          alignItems="baseline"
          display="flex"
          justifyContent="space-between"
          marginBottom={2.5}
        >
          <Typography
            component="p"
            sx={{
              color: "#24272CB3",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "16px",
            }}
          >
            {"Adjustments"}
          </Typography>
          <Link
            component="button"
            underline="hover"
            onClick={() => {
              toggleMoreAdjustments(!showMoreAdjustments);
            }}
            sx={{
              color: "#24272CB3",

              underline: {
                "&:before": {
                  borderColor: "#24272CB3",
                },

                "&:after": {
                  borderColor: `#24272CB3`,
                },

                "&:hover:not($disabled):not($focused):not($error):before": {
                  borderColor: `#24272CB3`,
                },
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                color: "#24272CB3",
                fontSize: "12px",
                fontWeight: 600,
                lineHeight: "14px",
              }}
            >
              {showMoreAdjustments ? "show less -" : "show more +"}
            </Typography>
          </Link>
        </Box>
        <Box>
          <Brightness />
          <Contrast />
          <Saturation />
          <Box
            component={Collapse}
            in={showMoreAdjustments}
            className="more-filters"
          >
            <Blur />
            <Enhance />
            <Red />
            <Green />
            <Blue />
          </Box>
        </Box>
        <Box
          alignItems="baseline"
          display="flex"
          justifyContent="space-between"
          marginTop={4}
          marginBottom={2.5}
        >
          <Typography
            component="p"
            sx={{
              color: "#24272CB3",
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "16px",
            }}
          >
            {"Filters"}
          </Typography>
          <Link
            component="button"
            underline="hover"
            onClick={() => {
              toggleMoreFilters(!showMoreFilters);
            }}
            sx={{
              color: "#24272CB3",

              underline: {
                "&:before": {
                  borderColor: "#24272CB3",
                },

                "&:after": {
                  borderColor: `#24272CB3`,
                },

                "&:hover:not($disabled):not($focused):not($error):before": {
                  borderColor: `#24272CB3`,
                },
              },
            }}
          >
            <Typography
              component="span"
              sx={{
                color: "#24272CB3",
                fontSize: "12px",
                fontWeight: 600,
                lineHeight: "14px",
              }}
            >
              {showMoreFilters ? "show less -" : "show more +"}
            </Typography>
          </Link>
        </Box>
        <Grid container spacing={1}>
          <Grid size={4}>
            <Button
              variant="contained"
              disableRipple
              sx={{
                backgroundColor: "transparent",
                border: "none",
                flexDirection: "column",
                p: 0,
                rowGap: "4px",
                textAlign: "center",

                "&:hover": {
                  backgroundColor: "transparent",
                },

                "& .MuiCardMedia-img": {
                  backgroundColor: "#C4C4C4",
                  borderRadius: "3px",
                },
              }}
            >
              <CardMedia
                component="img"
                image="/images/jpg/dream.jpg"
                alt="DreamImg"
              />
              <Typography
                component="span"
                sx={{
                  color: "#24272CB3",
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "14px",
                }}
              >
                {"Dream"}
              </Typography>
            </Button>
          </Grid>
          <Grid size={4}>
            <Button
              variant="contained"
              disableRipple
              sx={{
                backgroundColor: "transparent",
                border: "none",
                flexDirection: "column",
                p: 0,
                rowGap: "4px",
                textAlign: "center",

                "&:hover": {
                  backgroundColor: "transparent",
                },

                "& .MuiCardMedia-img": {
                  backgroundColor: "#C4C4C4",
                  borderRadius: "3px",
                },
              }}
            >
              <CardMedia
                component="img"
                image="/images/jpg/vibrant.jpg"
                alt="Vibrant"
              />
              <Typography
                component="span"
                sx={{
                  color: "#24272CB3",
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "14px",
                }}
              >
                {"Vibrant"}
              </Typography>
            </Button>
          </Grid>
          <Grid size={4}>
            <Button
              variant="contained"
              disableRipple
              sx={{
                backgroundColor: "transparent",
                border: "none",
                flexDirection: "column",
                p: 0,
                rowGap: "4px",
                textAlign: "center",

                "&:hover": {
                  backgroundColor: "transparent",
                },

                "& .MuiCardMedia-img": {
                  backgroundColor: "#C4C4C4",
                  borderRadius: "3px",
                },
              }}
            >
              <CardMedia
                component="img"
                image="/images/jpg/summer.jpg"
                alt="Summer"
              />
              <Typography
                component="span"
                sx={{
                  color: "#24272CB3",
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "14px",
                }}
              >
                {"Summer"}
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <Box component={Collapse} in={showMoreFilters} className="more-filters">
          <Grid container spacing={1}>
            <Grid size={4}>
              <Button
                variant="contained"
                disableRipple
                sx={{
                  backgroundColor: "transparent",
                  border: "none",
                  flexDirection: "column",
                  p: 0,
                  rowGap: "4px",
                  textAlign: "center",

                  "&:hover": {
                    backgroundColor: "transparent",
                  },

                  "& .MuiCardMedia-img": {
                    backgroundColor: "#C4C4C4",
                    borderRadius: "3px",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image="/images/jpg/dream.jpg"
                  alt="DreamImg"
                />
                <Typography
                  component="span"
                  sx={{
                    color: "#24272CB3",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "14px",
                  }}
                >
                  {"Dream"}
                </Typography>
              </Button>
            </Grid>
            <Grid size={4}>
              <Button
                variant="contained"
                disableRipple
                sx={{
                  backgroundColor: "transparent",
                  border: "none",
                  flexDirection: "column",
                  p: 0,
                  rowGap: "4px",
                  textAlign: "center",

                  "&:hover": {
                    backgroundColor: "transparent",
                  },

                  "& .MuiCardMedia-img": {
                    backgroundColor: "#C4C4C4",
                    borderRadius: "3px",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image="/images/jpg/vibrant.jpg"
                  alt="Vibrant"
                />
                <Typography
                  component="span"
                  sx={{
                    color: "#24272CB3",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "14px",
                  }}
                >
                  {"Vibrant"}
                </Typography>
              </Button>
            </Grid>
            <Grid size={4}>
              <Button
                variant="contained"
                disableRipple
                sx={{
                  backgroundColor: "transparent",
                  border: "none",
                  flexDirection: "column",
                  p: 0,
                  rowGap: "4px",
                  textAlign: "center",

                  "&:hover": {
                    backgroundColor: "transparent",
                  },

                  "& .MuiCardMedia-img": {
                    backgroundColor: "#C4C4C4",
                    borderRadius: "3px",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image="/images/jpg/summer.jpg"
                  alt="Summer"
                />
                <Typography
                  component="span"
                  sx={{
                    color: "#24272CB3",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "14px",
                  }}
                >
                  {"Summer"}
                </Typography>
              </Button>
            </Grid>
            <Grid size={4}>
              <Button
                variant="contained"
                disableRipple
                sx={{
                  backgroundColor: "transparent",
                  border: "none",
                  flexDirection: "column",
                  p: 0,
                  rowGap: "4px",
                  textAlign: "center",

                  "&:hover": {
                    backgroundColor: "transparent",
                  },

                  "& .MuiCardMedia-img": {
                    backgroundColor: "#C4C4C4",
                    borderRadius: "3px",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image="/images/jpg/dream.jpg"
                  alt="DreamImg"
                />
                <Typography
                  component="span"
                  sx={{
                    color: "#24272CB3",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "14px",
                  }}
                >
                  {"Dream"}
                </Typography>
              </Button>
            </Grid>
            <Grid size={4}>
              <Button
                variant="contained"
                disableRipple
                sx={{
                  backgroundColor: "transparent",
                  border: "none",
                  flexDirection: "column",
                  p: 0,
                  rowGap: "4px",
                  textAlign: "center",

                  "&:hover": {
                    backgroundColor: "transparent",
                  },

                  "& .MuiCardMedia-img": {
                    backgroundColor: "#C4C4C4",
                    borderRadius: "3px",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image="/images/jpg/vibrant.jpg"
                  alt="Vibrant"
                />
                <Typography
                  component="span"
                  sx={{
                    color: "#24272CB3",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "14px",
                  }}
                >
                  {"Vibrant"}
                </Typography>
              </Button>
            </Grid>
            <Grid size={4}>
              <Button
                variant="contained"
                disableRipple
                sx={{
                  backgroundColor: "transparent",
                  border: "none",
                  flexDirection: "column",
                  p: 0,
                  rowGap: "4px",
                  textAlign: "center",

                  "&:hover": {
                    backgroundColor: "transparent",
                  },

                  "& .MuiCardMedia-img": {
                    backgroundColor: "#C4C4C4",
                    borderRadius: "3px",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image="/images/jpg/summer.jpg"
                  alt="Summer"
                />
                <Typography
                  component="span"
                  sx={{
                    color: "#24272CB3",
                    fontSize: "12px",
                    fontWeight: 400,
                    lineHeight: "14px",
                  }}
                >
                  {"Summer"}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
        <ImageStroke />
        <ImageShadow />
      </Box>
    </Box>
  );
};

export default EditImage;
