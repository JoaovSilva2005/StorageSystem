import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useNavigate } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [alertas, setAlertas] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:3001/produtos/alertas", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setAlertas(res.data))
        .catch((err) => console.error("Erro ao buscar alertas:", err));
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      component="nav"
      position="fixed"
      sx={{
        backgroundColor: "#1976d2",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
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
          onClick={() => navigate("/")}
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            letterSpacing: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            userSelect: "none", // <- impede que o texto fique selecionado
          }}
        >
          <Inventory2OutlinedIcon sx={{ fontSize: 26 }} />
          StockManager
        </Typography>

        {/* Ícone de notificação */}
        <IconButton color="inherit" onClick={handleNotificationClick}>
          <Badge badgeContent={alertas.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Menu de notificações */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleNotificationClose}
        >
          {alertas.length === 0 ? (
            <MenuItem disabled>Nenhum alerta de estoque</MenuItem>
          ) : (
            alertas.map((p) => (
              <MenuItem key={p.id}>
                {p.nome} — {p.quantidade} unidades (mín.: {p.quantidade_minima})
              </MenuItem>
            ))
          )}
        </Menu>

        <Button
          color="inherit"
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
            border: "1px solid transparent",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderColor: "white",
            },
          }}
        >
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
