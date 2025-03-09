import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Button 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Dashboard = ({ user }) => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        
        <Typography variant="subtitle1" gutterBottom>
          Welcome, {user?.name || 'User'}!
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Mass Management Module */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Mass Management
              </Typography>
              <Typography variant="body1" paragraph>
                Conduct a self-audit for Mass Management Accreditation under the NHVAS.
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  component={RouterLink}
                  to="/mass-management"
                >
                  Start Audit
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* Coming Soon: Fatigue Management */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                Fatigue Management
              </Typography>
              <Typography variant="body1" paragraph>
                Conduct a self-audit for Fatigue Management Accreditation under the NHVAS.
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <Button 
                  variant="contained" 
                  disabled
                >
                  Coming Soon
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          {/* My Audits */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                My Audits
              </Typography>
              <Typography variant="body1">
                You haven't completed any audits yet. Start a new audit to track your compliance.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
