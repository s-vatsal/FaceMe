import React, {useEffect, useState} from 'react';
import {Grid, Button, Container, Typography, Card, CardContent, TextField} from '@material-ui/core';
import { apiUrl} from './constants';
import styles from './css/upload.module.css';
import Face from './types/Face'
import SubmitCard from './components/submitCard';

const ViewFace = () => {
    const [face, setFace] = useState<Face>();


    useEffect(() => {
        let url = window.location.href
        // @ts-ignore
        let filename = url.replace("http://localhost:3000/face/", '')

        console.log(filename)
        fetch(apiUrl + '/faces/' + filename).then(data => {
            return data.json();
        }).then(data => {
            console.log(data)
            setFace(data)
        }) 
    }, [])
    

    
    return (
        <>
            <Container className={styles.container}  maxWidth="md" >
            <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                            <Typography variant="h3">
                        {face?.faceName}
                        </Typography>
                        </div>
                <Grid container alignItems="stretch" spacing={1}>
                <Grid item xs={12} md={3} style={{ display: "flex" }} key={1}>
                                <SubmitCard faceName={face?.faceName || ''} filename={face?.filename || ''} imageUrl={face?.imageUrl|| ''} labels={ ['']} key={1}/>
                         </Grid>
                            <Grid item xs={12}>
                                        <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        placeholder="Name of face"
                                        type="text"
                                        fullWidth
                                        variant="outlined"
                                        value={face?.faceName}
                                        disabled/>
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                id="description"
                                multiline
                                fullWidth
                                rows={5}
                                variant="outlined"
                                inputProps={{ maxLength: 500 }}
                                value={face?.description}
                                // @ts-ignore
                                error={face?.description.length >= 500}
                                disabled
                                />
                                </Grid>
                                <Grid item xs={12}>
                            <Card variant="outlined">
                                <CardContent>
                                <Typography>
                                    <b>Features</b>
                                </Typography>
                                <Typography>
                                    {face?.labels.map((tag, index) => (
                                    <Button
                                        className={styles.tagButton}
                                        style={{
                                        margin: "5px",
                                        backgroundColor: "#545454",
                                        color: "white",
                                        }}
                                        key={index}
                                        variant="contained"
                                    >
                                        {tag}
                                    </Button>
                                    ))}
                                </Typography>
                                </CardContent>
                            </Card>
                            </Grid>
                       
                            </Grid>
                </Container>
    </>
    );
}

export default ViewFace;