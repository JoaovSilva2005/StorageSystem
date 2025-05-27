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
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";

const NavigationDrawer = () => (
  <Box sx={{ textAlign: "center" }}>
    <Typography variant="h6" sx={{ my: 2 }}>
      Estoque
    </Typography>
    <Divider />
    <List>
      <NavLink
        to="/produtos/form"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListItemButton>
          <ListItemIcon>
            <AddBoxIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Cadastrar Produto" />
        </ListItemButton>
      </NavLink>
      <NavLink
        to="/produtos/lista"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListItemButton>
          <ListItemIcon>
            <FormatListBulletedIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Listar Produtos" />
        </ListItemButton>
      </NavLink>

      <Divider sx={{ my: 1 }} />

      <NavLink
        to="/movimentacoes"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListItemButton>
          <ListItemIcon>
            <SyncAltIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Movimentações" />
        </ListItemButton>
      </NavLink>

      <Divider sx={{ my: 1 }} />

      <NavLink
        to="/fornecedores"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListItemButton>
          <ListItemIcon>
            <PeopleIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Fornecedores" />
        </ListItemButton>
      </NavLink>
      <NavLink
        to="/categorias"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ListItemButton>
          <ListItemIcon>
            <CategoryIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Categorias" />
        </ListItemButton>
      </NavLink>
    </List>
  </Box>
);

export default NavigationDrawer;
