import React from "react";
import { NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

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
    color: isActive ? activeColor : "inherit",
  });

  return (
    <Box sx={{ textAlign: "center", p: 1 }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Estoque
      </Typography>
      <Divider />
      <List>
        <NavLink
          to="/produtos/form"
          end
          style={({ isActive }) => getLinkStyle(isActive, "#1976d2")}
        >
          {({ isActive }) => (
            <ListItemButton selected={isActive}>
              <ListItemIcon>
                <AddBoxIcon color="primary" />
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
            <ListItemButton selected={isActive}>
              <ListItemIcon>
                <FormatListBulletedIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Listar Produtos" />
            </ListItemButton>
          )}
        </NavLink>

        <Divider sx={{ my: 1 }} />

        <NavLink
          to="/entrada"
          end
          style={({ isActive }) => getLinkStyle(isActive, "#0288d1")}
        >
          {({ isActive }) => (
            <ListItemButton selected={isActive}>
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
            <ListItemButton selected={isActive}>
              <ListItemIcon>
                <ArrowCircleDownIcon sx={{ color: "#d32f2f" }} />
              </ListItemIcon>
              <ListItemText primary="Saída de Estoque" />
            </ListItemButton>
          )}
        </NavLink>

        <Divider sx={{ my: 1 }} />

        <NavLink
          to="/movimentacoes"
          end
          style={({ isActive }) => getLinkStyle(isActive, "#2e7d32")}
        >
          {({ isActive }) => (
            <ListItemButton selected={isActive}>
              <ListItemIcon>
                <SyncAltIcon color="success" />
              </ListItemIcon>
              <ListItemText primary="Movimentações" />
            </ListItemButton>
          )}
        </NavLink>

        <Divider sx={{ my: 1 }} />

        <NavLink
          to="/fornecedores"
          end
          style={({ isActive }) => getLinkStyle(isActive, "#9c27b0")}
        >
          {({ isActive }) => (
            <ListItemButton selected={isActive}>
              <ListItemIcon>
                <PeopleIcon color="secondary" />
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
            <ListItemButton selected={isActive}>
              <ListItemIcon>
                <CategoryIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary="Categorias" />
            </ListItemButton>
          )}
        </NavLink>
      </List>
    </Box>
  );
};

export default NavigationDrawer;
