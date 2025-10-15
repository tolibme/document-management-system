import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    try {
      const res = await registerUser(form);
      
      console.log("Registration response:", res.data);
      
      // Check if registration returns both access and refresh tokens
      if (res.data.access && res.data.refresh) {
        const accessToken = res.data.access;
        const refreshToken = res.data.refresh;
        const user = res.data.user || res.data;
        
        console.log("Registration successful with tokens, logging in automatically...");
        login(user, accessToken, refreshToken);
        navigate("/dashboard");
      } else if (res.data.token) {
        // Legacy: If only single token returned (backwards compatibility)
        const token = res.data.token;
        const user = res.data.user || res.data;
        
        console.log("Registration successful with single token, logging in...");
        login(user, token, token); // Use same token for both (not ideal but backwards compatible)
        navigate("/dashboard");
      } else {
        // If no tokens returned, redirect to login
        console.log("Registration successful, redirecting to login...");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      // Set user-friendly error message
      if (error.response?.status === 409) {
        setError("Email already exists. Please use a different email.");
      } else if (error.response?.status === 400) {
        setError("Please fill all fields correctly.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" mb={2} fontWeight={700} color="primary">
          Create Account
        </Typography>
        {error && (
          <Typography 
            variant="body2" 
            color="error" 
            sx={{ mb: 2, textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
        <Typography mt={2} textAlign="center">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1976d2" }}>
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
