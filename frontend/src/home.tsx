import React, {useState, useEffect} from 'react';
import {Container, Grid, Tooltip, Typography} from '@material-ui/core';
import NavBar from './components/nav';
import { apiUrl } from './constants';
import SubmitCard from './components/submitCard';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import styles from './css/faces.module.css';
import { Link } from 'react-router-dom';
import Face from './types/Face';

const Home = () => {
  const [items, setItems] = useState<Face[]>([]);
  useEffect(() => {
    fetch(apiUrl + "/items").then(data => {
        return data.json();
    }).then(data => {
      console.log(data);
      setItems(data);
    }).catch(err => {
        console.log(err)
    })
}, []);

  return (
    <>
      <NavBar />
      <Container className={styles.container} maxWidth="md">
        <div className={styles.topBox}>
          <Tooltip title="Upload a new face" aria-label="Upload a new face">
            <Link to="/create">
              <Fab className={styles.fab} color="primary" aria-label="add">
                <AddIcon/>
              </Fab>
            </Link>
          </Tooltip>
        </div>
        <div className={styles.recommend}>
        <div style={{ marginTop: "5px", marginBottom: "5px" }}>
            <Typography variant="h3">
              <b>Your faces</b>
          </Typography>
          </div>
          <Grid container alignItems="stretch" spacing={1}>
            {items.map((face, index) => {
              return (
                <Grid item xs={12} md={3} style={{ display: "flex" }} key={index}>
                  <SubmitCard faceName={face.faceName} imageUrl={face.imageUrl} filename={face.filename}  key={index} labels={face.labels} />
                </Grid>
              );
            })}
          </Grid>
          </div>
      </Container>
      
    </>
  );
}

export default Home;