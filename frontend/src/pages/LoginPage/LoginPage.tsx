import React, { useState } from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { getUserByEmail } from "../../services/fetchUser";

/**
 * Render the LoginPage component.
 * @returns {React.FC}
 */
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles the login logic.
   */
  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    getUserByEmail(email)
      .then((userByEmail) => {
        if (userByEmail && userByEmail.password === password) {
          login(userByEmail.email);
          navigate("/profile");
        } else {
          alert("Invalid email or password");
        }
      })
      .catch((error) => {
        alert("User does not exist.");
        console.error(error);
      });
  };

  // Return =============================================================
  return (
    <Container component="main" maxWidth="xs" className="login-container">
      <Box className="login-box">
        <Typography component="h1" variant="h5" className="login-title">
          Login to your account
        </Typography>
        <Box
          component="form"
          noValidate
          className="login-form"
          onSubmit={handleLogin}
        >
          {/* Email input textfield */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password input textfield */}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login button */}
          <Button
            style={{ backgroundColor: "#001f3f" }}
            type="submit"
            fullWidth
            variant="contained"
            className="login-btn"
          >
            Login
          </Button>

          {/* Link to register page */}
          <Box className="login-link-box">
            <Typography variant="body2" className="login-link-text">
              Do not have an account? <Link to="/register">Register</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
