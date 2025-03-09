import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Link,
  Box,
  Alert
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Registration validation schema
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .max(50, 'Name cannot be more than 50 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  organization: Yup.string()
    .required('Organization name is required')
    .max(100, 'Organization name cannot be more than 100 characters')
});

const Register = ({ register }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = values;
      await register(registerData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ 
            name: '', 
            email: '', 
            password: '', 
            confirmPassword: '', 
            organization: '' 
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                id="name"
                name="name"
                label="Full Name"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                id="email"
                name="email"
                label="Email Address"
                type="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                id="organization"
                name="organization"
                label="Organization Name"
                error={touched.organization && Boolean(errors.organization)}
                helperText={touched.organization && errors.organization}
              />
              
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                id="password"
                name="password"
                label="Password"
                type="password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                sx={{ mt: 3, mb: 2 }}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
              
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/login" variant="body2">
                    Already have an account? Login
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Register;
