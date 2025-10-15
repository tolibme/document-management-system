import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, TextField, Typography, Paper, Alert } from "@mui/material";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      console.log("Attempting login...");
      const response = await loginUser(form);
      
      if (response.data) {
        const { access, refresh, user } = response.data;
        
        if (access && refresh) {
          console.log("Login successful! Saving tokens and redirecting...");
          
          // Save tokens and user data
          login(user, access, refresh);
          
          // Navigate to dashboard
          navigate("/dashboard");
        } else {
          setError("Invalid server response. Missing tokens.");
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
      
      if (error.response?.status === 401) {
        setError("Invalid email or password");
      } else if (error.response?.status === 400) {
        setError("Please fill in all fields");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
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
          Sign In
        </Typography>
        {error && (
          <Paper 
            elevation={2}
            sx={{ 
              mb: 2, 
              p: 2,
              bgcolor: "#ffebee",
              border: "1px solid #f44336",
              borderRadius: 2
            }}
          >
            <Alert severity="error" sx={{ bgcolor: "transparent" }}>
              {error}
            </Alert>
          </Paper>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            email="true"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <Button 
            type="button"
            fullWidth 
            variant="contained" 
            sx={{ mt: 2 }}
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>
        <Typography mt={2} textAlign="center">
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#1976d2" }}>
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
