import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar
      component="nav"
      position="fixed"
      sx={{
        backgroundColor: "#1976d2", // azul padrão do MUI, mas você pode mudar
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        zIndex: (theme) => theme.zIndex.drawer + 1, // para ficar acima do drawer
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton
          color="inherit"
          edge="start"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}
        >
          Sistema de Estoque
        </Typography>

        <Button
          color="inherit"
          onClick={handleLogout}
          sx={{
            textTransform: "none", // sem maiúsculas automáticas
            fontWeight: "bold",
            border: "1px solid transparent",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderColor: "white",
            },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
