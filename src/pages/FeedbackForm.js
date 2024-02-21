import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const FeedbackSubmission = () => {
  const navigate = useNavigate();

  const [feedbackData, setFeedbackData] = useState({
    title: '',
    description: '',
    category: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    title: '',
    description: '',
    category: '',
  });

  const [loading, setLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const categories = ['Bug Report', 'Feature Request', 'Improvement', 'General Feedback', 'Other'];

  const validateForm = () => {
    let isValid = true;
    const newValidationErrors = {};

    // Check if title is empty
    if (!feedbackData.title.trim()) {
      newValidationErrors.title = 'Title is required';
      isValid = false;
    }

    // Check if description is empty
    if (!feedbackData.description.trim()) {
      newValidationErrors.description = 'Description is required';
      isValid = false;
    }

    // Check if category is empty
    if (!feedbackData.category.trim()) {
      newValidationErrors.category = 'Category is required';
      isValid = false;
    }

    setValidationErrors(newValidationErrors);

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (validateForm()) {
      try {
        setLoading(true);
  
        // Get user_id and token from local storage
        const user_id = localStorage.getItem('userId');
        const token = localStorage.getItem('authToken');
  
        // Check if user_id and token are available
        if (!user_id || !token) {
          console.error('User ID or token not found in local storage');
          setErrorAlert(true);
          setLoading(false);
          return;
        }
  
        // Add user_id and token to headers
        const headers = {
          'x-access-token': token,
        };
  
        // Ensure a valid positive integer rating between 0 and 5
        const rating = Math.floor(Math.random() * 6); // Generate a random integer between 0 and 5
  
        // Add user_id and rating to feedbackDataWithAuth
        const feedbackDataWithAuth = {
          ...feedbackData,
          user_id: parseInt(user_id), // Ensure user_id is a number
          rating: Math.max(0, Math.min(5, rating)), // Ensure rating is between 0 and 5
        };
  
        // Send feedbackDataWithAuth to the server with headers
        const response = await axios.post('http://localhost:3000/feedback/submit', feedbackDataWithAuth, {
          headers: headers,
        });
  
        if (response.data.result) {
          setSuccessAlert(true);
          navigate('/feedback/list');
        } else {
          setErrorAlert(true);
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
        setErrorAlert(true);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Feedback validation failed');
    }
  };
  
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFeedbackData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear validation error when the user types
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleAlertClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessAlert(false);
    setErrorAlert(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper style={{ padding: '20px', width: '400px', borderRadius: '25px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
        <Typography variant="h5" gutterBottom>
          Feedback Submission
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            error={!!validationErrors.title}
            helperText={validationErrors.title}
            margin="normal"
            required
            fullWidth
            label="Title"
            name="title"
            value={feedbackData.title}
            onChange={handleChange}
          />
          <TextField
            error={!!validationErrors.description}
            helperText={validationErrors.description}
            margin="normal"
            required
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={feedbackData.description}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <Select
              error={!!validationErrors.category}
              helperText={validationErrors.category}
              value={feedbackData.category}  // Set the value based on state
              onChange={handleChange}
              displayEmpty
              fullWidth
              name="category"
            >
              <MenuItem value="" disabled>Select a category</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px', borderRadius: '15px' }}>
            Submit Feedback
          </Button>
        </form>
        {loading && <CircularProgress style={{ marginTop: '20px' }} />}
        {/* Success Alert */}
        <Snackbar open={successAlert} autoHideDuration={3000} onClose={handleAlertClose}>
          <MuiAlert elevation={6} variant="filled" onClose={handleAlertClose} severity="success">
            Feedback submitted successfully
          </MuiAlert>
        </Snackbar>
        {/* Error Alert */}
        <Snackbar open={errorAlert} autoHideDuration={3000} onClose={handleAlertClose}>
          <MuiAlert elevation={6} variant="filled" onClose={handleAlertClose} severity="error">
            Error submitting feedback. Please try again.
          </MuiAlert>
        </Snackbar>
      </Paper>
    </div>
  );
};

export default FeedbackSubmission;
