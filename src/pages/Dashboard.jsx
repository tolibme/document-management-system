import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Stack, 
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip
} from "@mui/material";
import {
  Home,
  PersonAdd,
  Inbox,
  Assignment,
  Visibility,
  Archive,
  Monitor,
  Description,
  AdminPanelSettings,
  FolderOpen,
  AccountCircle,
  Logout,
  Menu as MenuIcon
} from "@mui/icons-material";
import { validateAndRefreshTokens } from "../api/auth";

const drawerWidth = 280;

// Menu items with Uzbek labels and icons
const menuItems = [
  { text: "Bosh sahifa", icon: <Home />, key: "home" },
  { text: "Ro'yhatdan o'tqazish", icon: <PersonAdd />, key: "registration" },
  { text: "Kiruvchi", icon: <Inbox />, key: "incoming" },
  { text: "Topshiriqlar", icon: <Assignment />, key: "tasks" },
  { text: "Ijro nazorati", icon: <Visibility />, key: "monitoring" },
  { text: "Arxiv", icon: <Archive />, key: "archive" },
  { text: "Monitoring", icon: <Monitor />, key: "system-monitoring" },
  { text: "Umumiy hujjatlar", icon: <Description />, key: "general-docs" },
  { text: "Ichki hujjat admin", icon: <AdminPanelSettings />, key: "internal-admin" },
  { text: "Ichki hujjat", icon: <FolderOpen />, key: "internal-docs" }
];

export default function Dashboard() {
  const { user, logout, accessToken, refreshToken, updateAccessToken } = useContext(AuthContext);
  const [isValidating, setIsValidating] = useState(true);
  const [validationStatus, setValidationStatus] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState("home");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Check token validity when Dashboard mounts
  useEffect(() => {
    const checkTokens = async () => {
      console.log("Dashboard mounted - checking token validity...");
      setIsValidating(true);
      
      try {
        const result = {needsLogin: false, refreshed:false}
        // await validateAndRefreshTokens();
        
        if (result.needsLogin) {
          console.log("Tokens expired or invalid - logging out user");
          setValidationStatus("Tokens expired - redirecting to login...");
          logout();
          return;
        }
        
        if (result.refreshed) {
          setValidationStatus("Access token refreshed successfully");
          // Update the access token in AuthContext state
          const newAccessToken = localStorage.getItem("accessToken");
          if (newAccessToken) {
            updateAccessToken(newAccessToken);
          }
        } else {
          setValidationStatus("Tokens are valid");
        }
        
        console.log("Token validation complete - user can access dashboard");
        
        // Small delay to show validation status
        setTimeout(() => {
          setIsValidating(false);
        }, 1000);
        
      } catch (error) {
        console.error("Token validation error:", error);
        setValidationStatus("Token validation failed - logging out...");
        setTimeout(() => {
          logout();
        }, 1500);
      }
    };
    
    checkTokens();
  }, []); // Run once when component mounts

  // Handle menu item selection
  const handleMenuItemClick = (key) => {
    setSelectedMenuItem(key);
    setMobileOpen(false); // Close mobile drawer
  };

  // Handle user menu
  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  // Manual logout
  const handleLogout = () => {
    console.log("Manual logout clicked");
    setAnchorEl(null);
    logout();
  };

  // Toggle mobile drawer
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Show loading while validating tokens
  if (isValidating) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f0f4ff",
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Validating authentication...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {validationStatus}
        </Typography>
      </Box>
    );
  }

  // Sidebar content
  const drawerContent = (
    <Box>
      {/* Logo/Header */}
      <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Hujjat Tizimi
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Document Management
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ px: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.key} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={selectedMenuItem === item.key}
              onClick={() => handleMenuItemClick(item.key)}
              sx={{
                borderRadius: 2,
                mx: 1,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  }
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: selectedMenuItem === item.key ? 600 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
            {menuItems.find(item => item.key === selectedMenuItem)?.text || "Dashboard"}
          </Typography>

          {/* User Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip 
              label={`${user?.name || "User"}`}
              variant="outlined"
              size="small"
            />
            <IconButton onClick={handleUserMenuOpen}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {(user?.name || "U").charAt(0)}
              </Avatar>
            </IconButton>
          </Box>

          {/* User Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleUserMenuClose}>
              <ListItemIcon>
                <AccountCircle fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Chiqish
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8, // Account for AppBar height
          bgcolor: '#f5f5f5',
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom color="primary">
            {menuItems.find(item => item.key === selectedMenuItem)?.text || "Dashboard"}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Xush kelibsiz, {user?.name || "Foydalanuvchi"}! Bu yerda siz tanlagan bo'lim mazmuni ko'rsatiladi.
          </Typography>

          {/* Content based on selected menu item */}
          <Box sx={{ mt: 4 }}>
            {selectedMenuItem === "home" && (
              <Stack spacing={3}>
                <Typography variant="h6">Asosiy sahifa</Typography>
                <Typography variant="body2">
                  Bu yerda umumiy ma'lumotlar va tizim holati ko'rsatiladi.
                </Typography>
              </Stack>
            )}
            
            {selectedMenuItem === "registration" && (
              <Stack spacing={3}>
                <Typography variant="h6">Ro'yhatdan o'tqazish</Typography>
                <Typography variant="body2">
                  Yangi hujjatlarni ro'yhatdan o'tkazish bo'limi.
                </Typography>
              </Stack>
            )}

            {selectedMenuItem === "incoming" && (
              <Stack spacing={3}>
                <Typography variant="h6">Kiruvchi hujjatlar</Typography>
                <Typography variant="body2">
                  Tashkilotga kelgan hujjatlar ro'yhati.
                </Typography>
              </Stack>
            )}

            {/* Add more content sections as needed */}
            {selectedMenuItem !== "home" && selectedMenuItem !== "registration" && selectedMenuItem !== "incoming" && (
              <Stack spacing={3}>
                <Typography variant="h6">Bo'lim ishlab chiqilmoqda</Typography>
                <Typography variant="body2">
                  Ushbu bo'lim tez orada ishga tushiriladi.
                </Typography>
              </Stack>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
