import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  makeStyles,
  createStyles,
  Grid,
  Button,
  Avatar,
  IconButton,
  Drawer,
  MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";
import LoginDialogue from "./loginDialogue";
import RegisterDialogue from "./registerDialogue";
import LogoutButton from "./logoutButton";
import styles from "../css/header.module.css";
import Logo from '../assets/logo.png'
const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    container: {
      width: 1170,
      margin: "auto",
    },
    buttonFontSize: {
      fontSize: "12px",
      color: "#a1a1a1",
      textDecoration: "none",
    },
    AppBar: {
      backgroundColor: "#fff",
      backgroundSize: "cover",
    },
    mainLogo: {
      color: "#a1a1a1",
      justifyContent: "left",
      "&:hover": {
        background: "transparent",
      },
    },
    avatar: {
      height: "100%",
      width: "100px",
      borderRadius: 0,
    },
    loginButton: {
      background: "#e91e63",
      color: "#fff",
      borderRadius: "25px",
      padding: "0px 25px",
      marginLeft: "5px",
      "&:hover": {
        background: "#ff3b7d",
        boxShadow: "0px 2px 10px #888888",
      },
    },
    loginButtonMobile: {
      background: "#e91e63",
      color: "#fff",
      borderRadius: "25px",
      padding: "0px 25px",
      marginTop: "10px",
      "&:hover": {
        background: "#ff3b7d",
        boxShadow: "0px 2px 10px #888888",
      },
    },
    logoutButton: {
      background: "#fff",
      color: "#000",
      fontSize: "11px",
      border: "3px solid black",
      borderRadius: "25px",
      padding: "0px 25px",
      marginLeft: "5px",
      "&:hover": {
        background: "grey",
      },
    },
    logoutButtonMobile: {
      background: "#fff",
      color: "#000",
      fontSize: "11px",
      border: "3px solid black",
      borderRadius: "25px",
      padding: "0px 25px",
      marginLeft: "5px",
      "&:hover": {
        background: "grey",
      },
    },
    drawerContainer: {
      padding: "20px 30px",
    },
  })
);

type Props = {
  readonly loggedIn: boolean;
  readonly setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

function Nav({ loggedIn, setLoggedIn }: Props) {
  const [inMobileView, setInMobileView] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const classes = useStyles();

  type Link = {
    label: string;
    href: string;
    authWalled: boolean;
  };
  const LINKS: Link[] = [
    {
      label: "Home",
      href: "/",
      authWalled: false,
      },
      {
       label: "Search",
          href: "/search",
       authWalled: false
    }
  ];

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
        ? setInMobileView(true)
        : setInMobileView(false);
    };
    setResponsiveness();
    window.addEventListener("resize", () => setResponsiveness());
  }, []);

  const displayDesktop = () => {
    return (
      <div className={classes.root}>
        <AppBar position="static" color="default" className={classes.AppBar}>
          <Grid item sm={12} xs={12} className={classes.container}>
            <Toolbar>
              <Grid className={classes.grow}>
                <Link to="/">
                  <Button className={classes.mainLogo}>
                    <Avatar src={Logo} className={classes.avatar} />
                  </Button>
                </Link>
              </Grid>
              {LINKS.map(({ label, href, authWalled }) => {
                if (!authWalled || (authWalled && loggedIn)) {
                  return (
                    <Link to={href} className={styles.link} key={label}>
                      <Button
                        color="inherit"
                        className={classes.buttonFontSize}
                      >
                        {label}
                      </Button>
                    </Link>
                  );
                } else {
                  return null;
                }
              })}
              {loggedIn ? (
                <LogoutButton
                  logged={setLoggedIn}
                  className={classes.logoutButton}
                />
              ) : (
                <>
                  <LoginDialogue
                    logged={setLoggedIn}
                    buttonClassName={classes.loginButton}
                  />
                  <RegisterDialogue buttonClassName={classes.loginButton} />
                </>
              )}
            </Toolbar>
          </Grid>
        </AppBar>
      </div>
    );
  };

  const getDrawerChoices = () => {
    return LINKS.map(({ label, href, authWalled }) => {
      if (!authWalled || (authWalled && loggedIn)) {
        return (
          <Link
            to={href}
            className={styles.link}
            onClick={() => setIsDrawerOpen(false)}
            key={label}
          >
            <MenuItem>{label}</MenuItem>
          </Link>
        );
      } else {
        return null;
      }
    });
  };

  const displayMobile = () => {
    return (
      <Toolbar>
        <IconButton
          {...{
            edge: "start",
            color: "inherit",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: () => setIsDrawerOpen(true),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          {...{
            anchor: "left",
            open: isDrawerOpen,
            onClose: () => setIsDrawerOpen(false),
          }}
        >
          <div className={classes.drawerContainer}>
            {getDrawerChoices()}
            {loggedIn ? (
              <LogoutButton
                logged={setLoggedIn}
                className={classes.logoutButtonMobile}
              />
            ) : (
              <>
                <LoginDialogue
                  logged={setLoggedIn}
                  buttonClassName={classes.loginButtonMobile}
                />
                <RegisterDialogue buttonClassName={classes.loginButtonMobile} />
              </>
            )}
          </div>
        </Drawer>
        <img src={''} alt="fitme logo" className={styles.MobileLogo} />
      </Toolbar>
    );
  };

  return inMobileView ? displayMobile() : displayDesktop();
}

export default Nav;