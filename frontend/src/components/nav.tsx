import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function NavBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{color: "#166AD0", fontWeight: "bold"}}>L</span>
            <span style={{color: "#166AD0", fontWeight: "bold"}}>e</span>
            <span style={{ color: "#166AD0", fontWeight: "bold" }}>x</span>
            <span style={{color: "black", fontWeight: "bold"}}>c</span>
            <span style={{color: "black", fontWeight: "bold"}}>e</span>
            <span style={{color: "black", fontWeight: "bold"}}>s</span>
            <span style={{color: "black", fontWeight: "bold"}}>s</span>
            </Link>
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
