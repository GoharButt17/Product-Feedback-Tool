import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextRating from '../components/Ratings';
import { useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  Button,
  Modal,
  Box,
  Typography,
  TextField,
  Alert,
  AlertTitle,
  Snackbar,
  SnackbarContent,
} from '@mui/material';
import axios from 'axios';

const columns = [
  { id: 'title', label: 'Title', minWidth: 170 },
  { id: 'category', label: 'Category', minWidth: 100 },
  { id: 'user', label: 'User', minWidth: 170 },
];

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

export default function FeedbackListingTable() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState('');
  const [date, setDate] = useState(null);
  const [userNameError, setUserNameError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [alert, setAlert] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error('Authentication token not found. User may not be authenticated.');
          return;
        }

        const response = await axios.get('http://localhost:3000/feedback/list', {
          headers: {
            'x-access-token': token,
          },
        });

        setFeedbackItems(response.data.feedback || []);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };

    fetchFeedbackData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setCommentModalOpen(true);

    setUserName(`${row.firstname} ${row.lastname}` || '');
    setDate(row.created_at || '');
  };

  const handleCloseCommentModal = () => {
    setCommentModalOpen(false);
    setSelectedRow(null);
    setComment('');
  };

  const handleCommentSubmit = async () => {
    if (!userName.trim()) {
      setUserNameError(true);
      return;
    }
  
    if (!date) {
      setDateError(true);
      return;
    }
  
    if (!comment.trim()) {
      setCommentError(true);
      return;
    }
  
    setUserNameError(false);
    setDateError(false);
    setCommentError(false);
  
    try {
      const token = localStorage.getItem('authToken');
  
      if (!token) {
        console.error('Authentication token not found. User may not be authenticated.');
        return;
      }
  
      const { user_id, feedback_id } = selectedRow;
  
      setAlert({
        type: 'info',
        message: 'Submitting Comment...',
      });
  
      const response = await axios.post(
        'http://localhost:3000/feedback/comment/submit',
        {
          feedback_id: feedback_id,
          user_id: user_id,
          content: comment,
        },
        {
          headers: {
            'x-access-token': token,
          },
        }
      );
  
      if (response.data.result) {
        console.log('Comment posted successfully');
        setSnackbarMessage('Comment posted successfully');
        setSnackbarOpen(true);
        // Clear the alert state to prevent both success and error messages from displaying simultaneously
        setAlert(null);
      } else {
        console.error('Error posting the comment:', response.data.message);
        setAlert({
          type: 'error',
          message: `Error posting comment: ${response.data.message}`,
        });
      }
    } catch (error) {
      console.error('Error posting the comment:', error);
      setAlert({
        type: 'error',
        message: 'Error posting comment. Please try again.',
      });
    } finally {
      setUserName('');
      setDate(null);
      setComment('');
  
      handleCloseCommentModal();
    }
  };

  const handleModalExit = () => {
    setUserName('');
    setDate(null);
    setComment('');
    setUserNameError(false);
    setDateError(false);
    setCommentError(false);
    handleCloseCommentModal();
  };

  const handleSignout = async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        console.error('Authentication token not found. User may not be authenticated.');
        return;
      }

      const response = await axios.post('http://localhost:3000/users/sign-out', null, {
        headers: {
          'x-access-token': token,
        },
      });

      if (response.data.result) {
        console.log('User signed out successfully');
        setAlert({
          type: 'success',
          message: 'User signed out successfully',
        });
        navigate('/');
      } else {
        console.error('Error signing out the user:', response.data.message);
        setAlert({
          type: 'error',
          message: `Error signing out: ${response.data.message}`,
        });
      }
    } catch (error) {
      console.error('Error signing out the user:', error);
      setAlert({
        type: 'error',
        message: 'Error signing out. Please try again.',
      });
    }
  };

  const handleAlertClose = () => {
    setAlert(null);
  };

  const handleFeedbackSubmission = () => {
    navigate('/feedback/form');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        {alert && (
          <Alert severity={alert.type} onClose={handleAlertClose}>
            <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            {alert.message}
          </Alert>
        )}
        <Paper
          sx={{
            width: '80%',
            borderRadius: '30px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Poppins, sans-serif',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '25px',
            }}
          >
            <div style={{ fontSize: '30px' }}>Products Feedback</div>
            <div>
              <Button
                variant="outlined"
                style={{ marginRight: '10px', borderRadius: '20px' }}
                onClick={handleFeedbackSubmission}
              >
                Add Feedback
              </Button>
              <Button variant="outlined" onClick={handleSignout} style={{ borderRadius: '20px' }}>
                Sign Out
              </Button>
            </div>
          </div>
          <TableContainer
            sx={{
              maxHeight: '70vh',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '6px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      sx={{
                        minWidth: column.minWidth,
                        border: '1px solid #e0e0e0',
                        backgroundColor: '#f4f4f4',
                        padding: '8px',
                        borderRadius: '20px',
                        marginBottom: '5px',
                        fontSize: '19px',
                        fontWeight: 'medium',
                      }}
                    >
                      <div style={{ marginBottom: '5px', marginTop: '5px' }}>{column.label}</div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {feedbackItems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index} onClick={() => handleRowClick(row)} style={{ cursor: 'pointer' }}>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align="center"
                          sx={{
                            border: '1px solid #e0e0e0',
                            marginBottom: '3px',
                            borderRadius: '20px',
                            fontSize: '16px',
                          }}
                        >
                          {column.id === 'title' ? (
                            <>
                              {row[column.id]} <TextRating />
                            </>
                          ) : column.id === 'user' ? (
                            `${row.firstname} ${row.lastname}`
                          ) : (
                            row[column.id]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={feedbackItems.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={snackbarOpen}
          autoHideDuration={5000} // Adjust the duration as needed
          onClose={handleSnackbarClose}
        >
          <SnackbarContent
            message={snackbarMessage}
            style={{ backgroundColor: '#4CAF50' }} // Green color for success message
          />
        </Snackbar>

        <Modal open={commentModalOpen} onClose={handleModalExit} aria-labelledby="comment-modal-title">
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: '10px',
              boxShadow: 24,
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" id="comment-modal-title" gutterBottom>
              {selectedRow && `Comment for ${selectedRow.title}`}
            </Typography>
            <TextField
              label="UserName"
              fullWidth
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              error={userNameError}
              helperText={userNameError ? 'UserName is required' : ''}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Date"
              fullWidth
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={dateError}
              helperText={dateError ? 'Date is required' : ''}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Comment"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              error={commentError}
              helperText={commentError ? 'Comment is required' : ''}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleCommentSubmit}>
              Submit Comment
            </Button>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
}
