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

function SignUp() {
  const defaultTheme = createTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [loading, setLoading] = React.useState(false);
  const [errorAlert, setErrorAlert] = React.useState({
    open: false,
    message: '',
  });
  const [successAlert, setSuccessAlert] = React.useState({
    open: false,
    message: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newValidationErrors = {};

    // Validate first name
    if (!formData.firstName.trim()) {
      newValidationErrors.firstName = 'First Name is required';
      isValid = false;
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newValidationErrors.lastName = 'Last Name is required';
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newValidationErrors.email = 'Email is required';
      isValid = false;
    }

    // Validate password
    if (!formData.password.trim()) {
      newValidationErrors.password = 'Password is required';
      isValid = false;
    }

    setValidationErrors(newValidationErrors);

    return isValid;
  };

  const handleSignIn = async () => {
    if (validateForm()) {
      setLoading(true);

      try {
        const response = await axios.post('http://localhost:3000/users/sign-up', {
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          password: formData.password,
        });

        if (response.status === 200) {
          setSuccessAlert({
            open: true,
            message: 'Sign up successful. Redirecting to feedback list...',
          });
          navigate('/');
        } else {
          setErrorAlert({
            open: true,
            message: response.data.message || 'Sign up failed',
          });
        }
      } catch (error) {
        setErrorAlert({
          open: true,
          message: 'Error signing up. Please check you input details and try again.',
        });
        console.error('Error signing up:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form validation failed. Cannot sign up.');
    }
  };

  const handleAlertClose = () => {
    setErrorAlert({
      open: false,
      message: '',
    });
    setSuccessAlert({
      open: false,
      message: '',
    });
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear validation error when user types
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, position: 'relative' }}>
            {loading && <CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%', marginTop: '-20px', marginLeft: '-20px' }} />}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!validationErrors.lastName}
                  helperText={validationErrors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!validationErrors.password}
                  helperText={validationErrors.password}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSignIn}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>

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

      {/* Success Alert */}
      <Snackbar
        open={successAlert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleAlertClose}
          severity="success"
        >
          {successAlert.message}
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default SignUp;
