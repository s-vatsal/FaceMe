import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid, CircularProgress } from "@material-ui/core";
import styles from "../css/siginform.module.css";
import { apiUrl } from "../constants";

type Props = {
  logged: React.Dispatch<React.SetStateAction<boolean>>;
  buttonClassName: string;
};

const LoginDialog = ({ logged, buttonClassName }: Props) =>{
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [badLogin, setBadLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setEmail("");
    setPassword("");
    setOpen(false);
  };
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let opts = {
      email: email,
      password: password,
    };
    setIsLoading(true);
    fetch(apiUrl + '/login', {
      method: "POST",
      body: JSON.stringify(opts),
    })
      .then((r) => r.json())
      .then((token) => {
        if (token.access_token) {
          localStorage.setItem("access_token", token.access_token);
          setOpen(false);
          logged(true);
        } else {
          setBadLogin(true);
        }
        setIsLoading(false);
      });
  };
  return (
    <div>
      <Button className={buttonClassName} onClick={handleClickOpen}>
        Login
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleLogin}>
          <DialogTitle id="form-dialog-title">Log in</DialogTitle>
          <DialogContent>
            <DialogContentText>Please log into your account.</DialogContentText>
            <Grid container alignItems="center" justify="center">
              <Grid item lg={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Email Address"
                  type="email"
                  error={badLogin}
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className={styles.InputField}
                  required
                />
              </Grid>
              <Grid item lg={12}>
                <TextField
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  error={badLogin}
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className={styles.InputField}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            {isLoading ? (
              <CircularProgress className={styles.LoadingAnimation} size={25} />
            ) : (
              <Button color="primary" type="submit">
                Login
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
export default LoginDialog