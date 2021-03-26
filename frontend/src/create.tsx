import React, {useState} from 'react';
import {Grid, Button, Container, Typography, CircularProgress} from '@material-ui/core';
import NavBar from './components/nav';
import { apiUrl, storage} from './constants';
import {DropzoneArea} from 'material-ui-dropzone'
import styles from './css/upload.module.css';
import FaceCard from './components/card'

  
type View = "AWAITING" | "PROCESSING" | "RETURNED"

interface FaceData {
    filename: string,
    imageUrl: string,
    labels: string[],
}


const Create = () => {
    const [image, setImage] = useState<any>([])
    const [imageName, setImageName] = useState<string>('')
    const [view, setView] = useState<View>('AWAITING')
    const [face, setFace] = useState<FaceData>()
    
    const fileOnChange = (files: any) => {
        setImage(files[0]);
        if (files[0]) setImageName(files[0].name)
    }
    
    const sendImage =  (e: any) => {
        setView("PROCESSING")
        let formData = new FormData();
        const uploadTask = storage.ref(`/images/${imageName}`).put(image)
        //initiates the firebase side uploading 
      
        uploadTask.on('state_changed', (snap) => {
            console.log(snap)
        }, (err) => {
            console.log(err)
        }, async (): Promise<void>  => {
            const fireBaseUrl = await storage.ref('images').child(imageName).getDownloadURL()
            console.log(fireBaseUrl)
            formData.append('img_url', fireBaseUrl)
            // @ts-ignore
            formData.append('image', image);
            console.log('IMGAGE_URL', formData.get('img_url'))
        
            const response = await fetch(apiUrl + '/upload', {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const resData = await response.json()
                console.log(resData)
                setFace({
                    filename: resData.filename,
                    imageUrl: fireBaseUrl,
                    labels: resData.labels
                })
                setView("RETURNED")
            } else {
                setView("AWAITING")
            }
            });
    }
    return (
        <>
        <NavBar />
            <Container className={styles.container}  maxWidth="md" >
                {view === "AWAITING" && (
                    <>
                       <Typography variant="h4" component="h4" className={styles.UploadHeader}>
                      Upload an Image to scan
                                </Typography>
                    <div className={styles.UploadDiv}>
                        <DropzoneArea
                        onChange={fileOnChange}
                        filesLimit={1}
                        acceptedFiles={["image/jpeg", "image/png"]}
                        maxFileSize={5000000}
                        />
                    <label htmlFor="contained-button-file">
                    <Button variant="contained" color="primary" component="span" onClick={sendImage}>
                    Upload
                    </Button>
                    </label>   
                        </div>
                        </>
                )}
                {view === "PROCESSING" && (
                      <>
                      <Typography variant="h5">Doing some magic...</Typography>
                      <CircularProgress />
                      <Typography variant="subtitle1">
                        Give us ~10 seconds while we scan your image.
                      </Typography>
                    </>
                )}
                {view === "RETURNED" && (
                    <>
                        
                        <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justify="center"
                        style={{ minHeight: '100vh' }}
                        >
                        <Typography variant="h4" component="h4" className={styles.UploadHeader}>
                            Here is your face
                        </Typography>
                        <Grid item xs={3}>
                        
                      <FaceCard filename={face?.filename || ''} imageUrl={face?.imageUrl|| ''} labels={face?.labels || ['']} key={1}/>
                      </Grid>  
                        </Grid> 
                        </>
                )}
                </Container>
    </>
    );
}

export default Create;