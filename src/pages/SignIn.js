import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

function SignIn() {
  const defaultTheme = createTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = React.useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState({
    open: false,
    message: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newValidationErrors = {};

    // Check if email is empty
    if (!formData.email.trim()) {
      newValidationErrors.email = 'Email is required';
      isValid = false;
    }

    // Check if password is empty
    if (!formData.password.trim()) {
      newValidationErrors.password = 'Password is required';
      isValid = false;
    }

    setValidationErrors(newValidationErrors);

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateForm()) {
      // Form is valid, proceed with submission
      console.log('Form submitted:', formData);
    } else {
      // Form is not valid, do not submit
      console.log('Form validation failed');
    }
  };

  const handleSignIn = async () => {
    if (validateForm()) {
      setLoading(true);
  
      try {
        const response = await axios.post('http://localhost:3000/users/sign-in', {
          email: formData.email,
          password: formData.password,
        });
  
        if (response.status === 200) {
          // Save the token and user_id in localStorage
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('userId', response.data.user.user_id);
  
          console.log('User ID:', response.data.user.user_id);
          console.log('Token:', response.data.token);
  
          navigate('/feedback/list');
        } else {
          setErrorAlert({
            open: true,
            message: response.data.message || 'Sign in failed',
          });
        }
      } catch (error) {
        setErrorAlert({
          open: true,
          message: 'Invalid Credentials. Please try again!',
        });
        console.error('Error signing in:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form validation failed. Cannot sign in.');
    }
  };
  
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear validation error when the user types
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleAlertClose = () => {
    setErrorAlert({
      open: false,
      message: '',
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, position: 'relative' }}>
            {loading && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-20px', marginLeft: '-20px' }} />}
            <TextField
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* Error Alert */}
        <Snackbar
          open={errorAlert.open}
          autoHideDuration={6000}
          onClose={handleAlertClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleAlertClose}
            severity="error"
          >
            {errorAlert.message}
          </MuiAlert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
