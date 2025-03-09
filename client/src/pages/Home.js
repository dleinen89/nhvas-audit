import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Box, 
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Home = ({ isAuthenticated }) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 8 }}>
        {/* Hero Section */}
        <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h1" gutterBottom>
              Mass Management Accreditation Self-Audit Tool
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph>
              Simplify your NHVAS compliance with our comprehensive self-audit tool
            </Typography>
            <Box sx={{ mt: 4 }}>
              {isAuthenticated ? (
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  component={RouterLink}
                  to="/dashboard"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Grid container spacing={2}>
                  <Grid item>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large"
                      component={RouterLink}
                      to="/register"
                    >
                      Get Started
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="large"
                      component={RouterLink}
                      to="/login"
                    >
                      Login
                    </Button>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 4, 
                backgroundColor: 'primary.light',
                color: 'primary.contrastText'
              }}
            >
              <Typography variant="h5" gutterBottom>
                Why Use Our Self-Audit Tool?
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon sx={{ color: 'primary.contrastText' }} />
                  </ListItemIcon>
                  <ListItemText primary="Simplify compliance with NHVAS standards" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon sx={{ color: 'primary.contrastText' }} />
                  </ListItemIcon>
                  <ListItemText primary="Identify and address compliance gaps" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon sx={{ color: 'primary.contrastText' }} />
                  </ListItemIcon>
                  <ListItemText primary="Generate comprehensive audit reports" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleOutlineIcon sx={{ color: 'primary.contrastText' }} />
                  </ListItemIcon>
                  <ListItemText primary="Centralize document management" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          Key Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Interactive Checklists
              </Typography>
              <Typography variant="body1">
                Step-by-step guidance through all NHVAS Mass Management standards with detailed explanations and examples.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Document Management
              </Typography>
              <Typography variant="body1">
                Upload, organize, and cross-reference evidence documents to demonstrate compliance with multiple standards.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Comprehensive Reporting
              </Typography>
              <Typography variant="body1">
                Generate detailed reports highlighting compliance status, gaps, and recommended actions to improve your systems.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
