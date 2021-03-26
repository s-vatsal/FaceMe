import React from 'react'
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress
} from '@material-ui/core'

interface Props {
    filename: string,
    imageUrl: string,
    labels: string[],
    key: number,
    faceName: string
}
  
const SubmitCard: React.FC<Props> = ({faceName, labels, filename, imageUrl, key}) => {
    return (
        <Card
        style={{
            display: "flex",
            justifyContent: "space-between",
                flexDirection: "column",
                width: "300px" 
            }}
            key={key}
        >
            <CardActionArea>
                {imageUrl ? (
                    <CardMedia
                        image={imageUrl}
                        style={{ height: "300px", paddingTop: "2%"}}
                        title={filename} />
                ) : (
                    <CircularProgress />
                )}
            <CardContent>
                <Typography variant="body2" style={{color: 'gray'}}>
                <b>{faceName}</b> 
                        
                    </Typography>
                    <Typography variant="subtitle2" style={{color: 'gray'}}>
                    {labels.join(', ')}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
export default SubmitCard