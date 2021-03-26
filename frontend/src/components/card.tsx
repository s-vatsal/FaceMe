import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

interface Props {
  filename: string,
  imagePath: string,
  phoneme: string,
  key: number
}

const PhonemeCards: React.FC<Props> = ({phoneme, filename, imagePath, key}) => {
  const classes = useStyles();
  const image = imagePath.replace("/Users/nishgowda/Desktop/Code/Projects/neuro_hack/frontend/public/", '../')
  console.log(image)
  return (
    <Card className={classes.root} key={key}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={image}
          title={filename}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {  filename }
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
          { phoneme }
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
export default PhonemeCards;