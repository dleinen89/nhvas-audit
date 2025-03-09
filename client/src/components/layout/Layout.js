import React from 'react';
import { Box, CssBaseline, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, isAuthenticated, logout }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <CssBaseline />
      <Header isAuthenticated={isAuthenticated} logout={logout} />
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
