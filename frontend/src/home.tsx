import React, {useState, useEffect} from 'react';
import {Container, Grid, Tooltip, Typography, Card, CardContent} from '@material-ui/core';
import { apiUrl } from './constants';
import FaceCard from './components/faceCard';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import styles from './css/faces.module.css';
import { Link } from 'react-router-dom';
import Face from './types/Face';

type Props = {
  isLoggedIn: boolean;
};

const Home: React.FC<Props> = ({ isLoggedIn }) => {
  const [items, setItems] = useState<Face[]>([]);
  const [featureFilter, setFeatureFilter] = useState('none');
  const [allLabels, setAllLables] = useState<string[]>(['']);

  useEffect(() => {
    if (featureFilter === "none") {
      const accessToken = localStorage.getItem("access_token");
      const accessTokenString = 'Bearer ' + accessToken
      fetch(apiUrl + "/faces", {
        method: "GET",
        headers: {
          Authorization: isLoggedIn ? accessTokenString : ''
        }
      }).then(data => {
        return data.json();
    }).then(data => { 
      setItems(data);
    }).catch(err => {
        console.log(err)
    })
    }
    
  }, [featureFilter, isLoggedIn]);
  
  useEffect(() => {
    if (featureFilter !== "none") {
      fetch(apiUrl + '/face_feature/' + featureFilter).then(data => {
        return data.json()
      }).then(data => {
        setItems(data);
      })
    }
  }, [featureFilter]);

  useEffect(() => {
    fetch(apiUrl + '/face_features').then(data => {
      return data.json();
    }).then(data => {
      setAllLables(data);
    })
  }, [])

  return (
    <>
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
        {items.length > 1 && (
          <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="h4">Filter</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>
                      <u>Feature</u>
                    </Typography>
                  </Grid>
                  {featureFilter !== "none" && (
                    <Grid item xs={12}>
                      <b
                        style={{ cursor: "pointer", color: "gray" }}
                        onClick={(e) => {
                          setFeatureFilter("none");
                        }}
                      >
                        <u>Clear filter</u>
                      </b>
                    </Grid>
                  )}
                 {allLabels.map((label) => {
                    return (
                      <Grid item xs={12} key={label}>
                        <b
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            setFeatureFilter(label);
                          }}
                        >
                          {label === featureFilter && "- "}
                          {label}
                        </b>
                      </Grid>
                    );
                  })}
                    
                </Grid>
              </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} sm={9}>
        <div className={styles.recommend}>
      <div style={{ marginTop: "5px", marginBottom: "5px" }}>
          <Typography variant="h3">
            <b>Your faces</b>
        </Typography>
            </div>
            </div>
        <Grid container alignItems="stretch" spacing={1}>
       
          {items.map((face, index) => {
            return (
              <Grid item xs={12} md={3} style={{ display: "flex" }} key={index}>
                <FaceCard faceName={face.faceName} imageUrl={face.imageUrl} filename={face.filename}  key={index} labels={['']} />
              </Grid>
            );
          })}
        </Grid>
        </Grid>
          </Grid>
        )}
        {items.length < 1 && (
          <Typography variant="h3">
              You have no faces saved yet
          </Typography>
        )}
      </Container>
      
    </>
  );
}

export default Home;