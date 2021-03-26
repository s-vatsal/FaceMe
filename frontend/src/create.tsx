import React, {useState} from 'react';
import {Grid, Button, Container, Typography, CircularProgress} from '@material-ui/core';
import NavBar from './components/nav';
import { apiUrl, storage} from './constants';
import {DropzoneArea} from 'material-ui-dropzone'
import styles from './css/upload.module.css';
import PhonemeCard from './components/card'

  
type View = "AWAITING" | "PROCESSING" | "RETURNED"

interface Phoneme {
    filename: string,
    imagePath: string,
    text: string[],
    phoneme: string[],
}


const CreatePhoneme = () => {
    const [image, setImage] = useState<any>([])
    const [imageName, setImageName] = useState<string>('')
    const [view, setView] = useState<View>('AWAITING')
    const [phoneme, setPhoneme] = useState<Phoneme>()
    const allInputs = {imgUrl: ''}
    const [imageAsUrl, setImageAsUrl] = useState(allInputs)
    
    const fileOnChange = (files: any) => {
        setImage(files[0]);
        if (files[0])
            setImageName(files[0].name)
    }

    
    const sendImage = async (e: any) : Promise<void> => {
        setView("PROCESSING")
        let formData = new FormData();
        const uploadTask = storage.ref('/images/' + imageName).put(image)
        uploadTask.on('state_changed', (snap) => {
            console.log(snap)
        }, (err) => {
            console.log(err)
        }, () => {
            storage.ref('images').child(imageName).getDownloadURL()
                .then(fireBaseUrl => {
                 setImageAsUrl(prevObject => ({...prevObject, imgUrl: fireBaseUrl}))
                console.log('FIREBASE', fireBaseUrl)
            })
        })
          // @ts-ignore
        formData.append('image', image);
        formData.append('img_url', imageAsUrl.imgUrl)
        console.log(formData.get('img_url'))
    
        const response = await fetch(apiUrl + '/upload', {
            method: "POST",
            body: formData,

        });
        if (response.ok) {
            const resData = await response.json()
            console.log(resData)
            const imagePath = resData.path.replace("/Users/nishgowda/Desktop/Code/Projects/neuro_hack/frontend/public/", '../')
            setPhoneme({
                filename: resData.filename,
                imagePath: imagePath,
                text: resData.text,
                phoneme: resData.phoneme
            })
            setView("RETURNED")
        } else {
            setView("AWAITING")
        }
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
                            Here are the Phonemes found
                        </Typography>
                        <Grid item xs={3}>
                        
                      <PhonemeCard filename={phoneme?.filename || ''} imagePath={phoneme?.imagePath|| ''} phoneme={phoneme?.phoneme.join('')|| ''} key={1}/>
                      </Grid>  
                        </Grid> 
                        
                            
                        
                        </>
                )}
                </Container>
    </>
    );
}

export default CreatePhoneme;