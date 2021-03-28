import React from 'react'
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from '@material-ui/core'
import {Link } from 'react-router-dom'
interface Props {
    filename: string,
    imageUrl: string,
    labels: string[],
    key: number,
    faceName: string
}
  
const FaceCard: React.FC<Props> = ({faceName, labels, filename, imageUrl, key}) => {
    return (
        <Link to={`/face/${filename}`} style={{ textDecoration: "none" }}>
        <Card
        style={{
            display: "flex",
            justifyContent: "space-between",
                flexDirection: "column",
            }}
            key={key}
        >
           <CardActionArea>
                <CardMedia
            component="img"
            alt={filename}
                        height="300"
                        width="300"
            image={imageUrl}
            title={filename}
          /> 
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
            </Link>
    )
}
export default FaceCard