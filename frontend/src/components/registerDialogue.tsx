import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import styles from "../css/siginform.module.css";
import { Grid, Snackbar } from "@material-ui/core";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { apiUrl } from "../constants";
import emailIsValid from './utils';

type Props = {
  readonly buttonClassName: string;
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function RegisterDialog({ buttonClassName }: Props) {
  type HelperText = {
    emailText: [string, boolean];
    usernameText: [string, boolean];
    passwordText: [string, boolean];
  };
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [successfulRegistration, setSuccessfulRegistration] = useState(false);

  const [helperText, setHelperText] = useState<HelperText>({
    emailText: ["", false],
    usernameText: ["must be between 4-16 characters", false],
    passwordText: ["must be at least 8 characters", false],
  });

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const invalidEmail = !emailIsValid(email);
    const invalidUsername = username.length < 4 || username.length > 16;
    const invalidPassword = password.length < 8 || password.length > 128;

    setHelperText({
      emailText: invalidEmail ? ["Invalid email!", true] : ["", false],
      usernameText: invalidUsername
        ? ["username doesn't fit requirements (between 4-16 characters)", true]
        : ["", false],
      passwordText: invalidPassword
        ? ["password doesn't fit requirements (min 8 characters)", true]
        : ["", false],
    });
    if (!invalidEmail && !invalidPassword && !invalidUsername) {
      const opts = {
        email: email,
        username: username,
        password: password,
      };
      const response = await fetch(`${apiUrl}/register`, {
        method: "POST",
        body: JSON.stringify(opts),
      });
      if (response.ok) {
        setOpen(false);
        setSuccessfulRegistration(true);
      }
      const json = await response.json();
      const emailExists =
        json.message === "A user with that email already exists.";
      const usernameExists =
        json.message === "A user with that username already exists.";

      setHelperText({
        passwordText: ["", false],
        usernameText: usernameExists
          ? ["Someone with that username already exists.", true]
          : ["", false],
        emailText: emailExists
          ? ["Someone with that email already exists.", true]
          : ["", false],
      });
    }
  };
  return (
    <div>
      <Snackbar open={successfulRegistration} autoHideDuration={6000}>
        <Alert
          onClose={() => setSuccessfulRegistration(false)}
          severity="success"
        >
          Registration successful! You can now log in on the top right.
        </Alert>
      </Snackbar>
      <Button className={buttonClassName} onClick={() => setOpen(true)}>
        Sign Up
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleRegister}>
          <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Fill out the items below to register.
            </DialogContentText>
            <Grid container alignItems="center" justify="center">
              <Grid item lg={12}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="email-input"
                  label="Email Address"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className={styles.InputField}
                  helperText={helperText.emailText[0]}
                  error={helperText.emailText[1]}
                  required
                />
              </Grid>
              <Grid item lg={12}>
                <TextField
                  margin="dense"
                  id="username-input"
                  label="Username"
                  type="username"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  className={styles.InputField}
                  helperText={helperText.usernameText[0]}
                  error={helperText.usernameText[1]}
                  required
                />
              </Grid>
              <Grid item lg={12}>
                <TextField
                  margin="dense"
                  id="password"
                  label="Password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className={styles.InputField}
                  helperText={helperText.passwordText[0]}
                  error={helperText.passwordText[1]}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Register
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}