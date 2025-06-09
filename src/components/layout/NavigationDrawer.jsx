import React from "react";
import { NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";

const NavigationDrawer = () => {
  const getLinkStyle = (isActive, activeColor) => ({
    textDecoration: "none",
    color: isActive ? activeColor : "rgba(0,0,0,0.8)",
    fontWeight: isActive ? "600" : "400",
  });

  const listItemSx = (isActive, activeColor) => ({
    borderRadius: 1,
    mb: 0.5,
    color: isActive ? activeColor : "rgba(0,0,0,0.8)",
    transition: "all 0.3s ease",
    "&:hover": {
      bgcolor: isActive ? activeColor + "33" : "rgba(0,0,0,0.04)",
      color: activeColor,
    },
    "& .MuiListItemIcon-root": {
      color: isActive ? activeColor : "rgba(0,0,0,0.54)",
      minWidth: 36,
    },
  });

  return (
    <Box
      sx={{
        textAlign: "center",
        p: 2,
        bgcolor: "#fafafa",
        borderRadius: 2,
        boxShadow: "0 4px 12px rgb(0 0 0 / 0.1)",
        maxWidth: 280,
        mx: "auto",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          my: 2,
          fontWeight: "700",
          letterSpacing: 1.1,
          color: "#1976d2",
        }}
      >
        Estoque
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        <NavLink
          to="/produtos/form"
          end
          style={({ isActive }) => getLinkStyle(isActive, "#1976d2")}
        >
          {({ isActive }) => (
            <ListItemButton
              sx={listItemSx(isActive, "#1976d2")}
              selected={isActive}
            >
              <ListItemIcon>
                <AddBoxIcon sx={{ color: "#1976d2" }} />
              </ListItemIcon>
              <ListItemText primary="Cadastrar Produto" />
            </ListItemButton>
          )}
        </NavLink>

        <NavLink
          to="/produtos/lista"
          end
          style={({ isActive }) => getLinkStyle(isActive, "#1976d2")}
        >
          {({ isActive }) => (
            <ListItemButton
              sx={listItemSx(isActive, "#1976d2")}
              selected={isActive}
            >
              <ListItemIcon>
                <FormatListBulletedIcon sx={{ color: "#1976d2" }} />
              </ListItemIcon>
              <ListItemText primary="Listar Produtos" />
            </ListItemButton>
          )}
        </NavLink>

        <Divider sx={{ my: 2 }} />

        <NavLink
          to="/entrada"
          end
          style={({ isActive }) => getLinkStyle(isActive, "#0288d1")}
        >
          {({ isActive }) => (
            <ListItemButton
              sx={listItemSx(isActive, "#0288d1")}
              selected={isActive}
            >
              <ListItemIcon>
                <ArrowCircleUpIcon sx={{ color: "#0288d1" }} />
              </ListItemIcon>
              <ListItemText primary="Entrada de Estoque" />
            </ListItemButton>
          )}
        </NavLink>

        <NavLink
          to="/saida"
          end
          style={({ isActive }) => getLinkStyle(isActive, "#d32f2f")}
        >
          {({ isActive }) => (
            <ListItemButton
              sx={listItemSx(isActive, "#d32f2f")}
              selected={isActive}
            >
              <ListItemIcon>
                <ArrowCircleDownIcon sx={{ color: "#d32f2f" }} />
              </ListItemIcon>
              <ListItemText primary="Saída de Estoque" />
            </ListItemButton>
          )}
        </NavLink>

        <Divider sx={{ my: 2 }} />

        <NavLink
          to="/movimentacoes"
          end
          style={({ isActive }) => getLinkStyle(isActive, "#2e7d32")}
        >
          {({ isActive }) => (
            <ListItemButton
              sx={listItemSx(isActive, "#2e7d32")}
              selected={isActive}
            >
              <ListItemIcon>
                <SyncAltIcon sx={{ color: "#2e7d32" }} />
              </ListItemIcon>
              <ListItemText primary="Movimentações" />
            </ListItemButton>
          )}
        </NavLink>

        <Divider sx={{ my: 2 }} />

        <NavLink
          to="/fornecedores"
          end
          style={({ isActive }) => getLinkStyle(isActive, "#9c27b0")}
        >
          {({ isActive }) => (
            <ListItemButton
              sx={listItemSx(isActive, "#9c27b0")}
              selected={isActive}
            >
              <ListItemIcon>
                <PeopleIcon sx={{ color: "#9c27b0" }} />
              </ListItemIcon>
              <ListItemText primary="Fornecedores" />
            </ListItemButton>
          )}
        </NavLink>

        <NavLink
          to="/categorias"
          end
          style={({ isActive }) => getLinkStyle(isActive, "#9c27b0")}
        >
          {({ isActive }) => (
            <ListItemButton
              sx={listItemSx(isActive, "#9c27b0")}
              selected={isActive}
            >
              <ListItemIcon>
                <CategoryIcon sx={{ color: "#9c27b0" }} />
              </ListItemIcon>
              <ListItemText primary="Categorias" />
            </ListItemButton>
          )}
        </NavLink>

        {/* Nova seção para Dashboard e futuros itens */}
        <Divider sx={{ my: 2 }} />
        <Typography
          variant="subtitle2"
          sx={{ px: 2, mb: 1, color: "rgba(0,0,0,0.54)", fontWeight: "600" }}
        >
          Administração
        </Typography>
        <NavLink
          to="/dashboard"
          end
          style={({ isActive }) => getLinkStyle(isActive, "#1976d2")}
        >
          {({ isActive }) => (
            <ListItemButton
              sx={listItemSx(isActive, "#1976d2")}
              selected={isActive}
            >
              <ListItemIcon>
                <DashboardIcon sx={{ color: "#1976d2" }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          )}
        </NavLink>
      </List>
    </Box>
  );
};

export default NavigationDrawer;
