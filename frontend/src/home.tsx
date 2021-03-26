import React, {useState, useEffect} from 'react';
import {Grid} from '@material-ui/core';
import NavBar from './components/nav';
import { makeStyles } from '@material-ui/core/styles';
import { apiUrl } from './constants';
import FaceCard from './components/card';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  fab: {
    margin: theme.spacing(2),
    backgroundColor: "#1589FF"
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const Home = () => {
  const classes = useStyles();
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch(apiUrl + "/items").then(data => {
        return data.json();
    }).then(data => {
      console.log(data);
      console.log(data)
        setItems(data);
    }).catch(err => {
        console.log(err)
    })
}, []);

  return (
    <div className={classes.root}>
      <NavBar />
      <Fab className={classes.fab} href="/create">
          <AddIcon />
        </Fab>
      <Grid container justify="center" spacing={3} >

        {items.map((item, index) => (
          
        <Grid item xs={3}>
            <FaceCard labels={item.labels} filename={item.filename} imageUrl={item.img_url} key={index}/>
        </Grid> 
       ))}
        </Grid>
      
    </div>
  );
}

export default Home;
