import { Fragment } from "react";
import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/system";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
  hero: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    margin: "0 auto",
    maxWidth: "90%",
    paddingTop: "55px",
    rowGap: "33px",
    width: "100%",

    "& .not-found": {
      height: "auto",
      maxWidth: "100%",
      marginBottom: "16px",
    },

    "& .heading": {
      color: "#000000",
      fontSize: "24px",
      fontWeight: 500,
      lineHeight: "28px",
      textAlign: "center",
    },

    "& .actions": {
      alignItems: "center",
      display: "flex",
      justifyContent: "center",
      columnGap: "20px",

      "& .MuiButton-root": {
        height: "48px",
        width: "105px",
      },
    },
  },

  [theme.breakpoints.up("md")]: {
    hero: {
      maxWidth: "100%",
      paddingTop: "66px",
    },
  },
}));

const Notfound = () => {
  const classes = useStyles();
  const history = useNavigate();

  return (
    <Fragment>
      <section className={classes.hero}>
        <img
          src={"/images/svg/404.svg"}
          alt="404"
          className="not-found"
          loading="lazy"
          height={447}
          width={677}
        />
        <h1 className="heading">
          {"Oops! We couldn't find the page you are looking for."}
        </h1>
        <div className="actions">
          <Button variant="outlined" color="primary" href="/">
            {"Home"}
          </Button>
          <Button variant="contained" onClick={() => history(-1)}>
            {"Go Back"}
          </Button>
        </div>
      </section>
    </Fragment>
  );
};

export default Notfound;
