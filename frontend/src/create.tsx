import React, {useState} from 'react';
import {Grid, Button, Container, Typography, CircularProgress, TextField} from '@material-ui/core';
import ChipInput from "material-ui-chip-input";
import { apiUrl, storage} from './constants';
import {DropzoneArea} from 'material-ui-dropzone'
import styles from './css/upload.module.css';
import Face from './types/Face'
import SubmitCard from './components/submitCard';

type View = "AWAITING" | "PROCESSING"  | "RETURNED"| "EDITING" | "FINSIHED"

const Create = () => {
    const [image, setImage] = useState<any>([])
    const [imageName, setImageName] = useState<string>('')
    const [imageUrl, setImageUrl] = useState<string>('')
    const [view, setView] = useState<View>('AWAITING')
    const [face, setFace] = useState<Face>()
    const [faceName, setFaceName] = useState<string>('')
    const [labels, setLabels] = useState <string []> ([''])
    const [description, setDescription] = useState<string>('')

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
            setImageUrl(fireBaseUrl)
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
                    faceName: faceName,
                    filename: resData.filename,
                    imageUrl: fireBaseUrl,
                    labels: resData.labels,
                    description: ''
                })
                setLabels(resData.labels)
                setView("RETURNED")
            } else {
                setView("AWAITING")
            }
            });
    }
    
    const submitFinalImage = async (e:any): Promise<void> => {
        e.preventDefault()
        setView("EDITING")
        let formData = new FormData()
        formData.append('filename', imageName)
        formData.append('labels', JSON.stringify(labels))
        formData.append('imageUrl', imageUrl)
        formData.append('faceName', faceName)
        formData.append('description', description)
        const response = await fetch(apiUrl + '/submit_face', {
            method: "POST",
            body: formData
        });
        if (response.ok) {
            const resData = await response.json()
            console.log(resData);
            setView("FINSIHED")
            window.location.href = "/"
        } else {
            setView("EDITING")
        }
    }
    const handleNameChange = (e: any) => {
        setFaceName(e.target.value)
    }
    const handleDescriptionChange = (e: any) => {
        setDescription(e.target.value)
    }
    const handleLabelChange = (tags: any) => {
        console.log(tags)
        setLabels(tags)
    }
    
    return (
        <>
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
                    <Button  variant="outlined" component="span" onClick={sendImage}>
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
                         <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                            <Typography variant="h3">
                            Here's what we found
                        </Typography>
                        </div>
                        <form noValidate autoComplete="off" onSubmit={submitFinalImage}>
                        <Grid container spacing={2}>
                        <Grid item xs={12} md={3} style={{ display: "flex" }} key={1}>
                                <SubmitCard faceName={face?.faceName || ''} filename={face?.filename || ''} imageUrl={face?.imageUrl|| ''} labels={ ['']} key={1}/>
                                </Grid>
                                <Grid item xs={12}>
                                            <ChipInput
                                        key={1}
                                        label="Features"
                                        id="Features"
                                        defaultValue={labels}
                                        onChange={(tags: any) => handleLabelChange(tags)}
                                        className={styles.TagInput}
                                        variant="outlined"
                                        fullWidth
                                        />
                                </Grid>
                            <Grid item xs={12}>
                                        <TextField
                                        autoFocus
                                        margin="dense"
                                        id="name"
                                        label="Name of face"
                                        type="text"
                                        fullWidth
                                        onChange={handleNameChange}
                                        variant="outlined"
                                        value={faceName}
                                        required/>
                            </Grid>
                            <Grid item xs={12}>
                            <TextField
                                id="description"
                                label="Description (<500 characters)"
                                multiline
                                fullWidth
                                rows={5}
                                variant="outlined"
                                inputProps={{ maxLength: 500 }}
                                value={description}
                                error={description.length >= 500}
                                onChange={handleDescriptionChange}
                                required
                                />
                                </Grid>
                                <Grid item xs={12}>
                                <Button variant="outlined" type="submit">
                                Publish
                                </Button>
                            </Grid>
                            </Grid>
                            </form>
                        </>
                )}
                {view === "EDITING" && (
                   <CircularProgress/>
                )}
                </Container>
    </>
    );
}

export default Create;