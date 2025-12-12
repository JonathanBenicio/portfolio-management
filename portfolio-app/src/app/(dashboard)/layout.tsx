'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PieChartIcon from '@mui/icons-material/PieChart'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import SettingsIcon from '@mui/icons-material/Settings'
import ChatIcon from '@mui/icons-material/Chat'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import PaletteIcon from '@mui/icons-material/Palette'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useTheme } from '@/lib/theme.tsx'
import ProtectedRoute from '@/components/ProtectedRoute'

const drawerWidth = 240

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Renda Fixa', icon: <AttachMoneyIcon />, path: '/fixed-income' },
  { text: 'Renda Variável', icon: <ShowChartIcon />, path: '/variable-income' },
  { text: 'Análise', icon: <PieChartIcon />, path: '/analysis' },
  { text: 'Importar', icon: <FileUploadIcon />, path: '/import' },
  { text: 'IA Chat', icon: <ChatIcon />, path: '/chat' },
  { text: 'Design System', icon: <PaletteIcon />, path: '/design-system' },
  { text: 'Configurações', icon: <SettingsIcon />, path: '/settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { mode, toggleTheme } = useTheme()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    logout()
  }

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Portfolio
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/')
          return (
            <Link href={item.path} key={item.text} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={isActive}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(0, 153, 99, 0.08)',
                      borderRight: '3px solid',
                      borderRightColor: 'primary.main',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{ color: isActive ? 'primary.main' : 'text.primary' }}
                  />
                </ListItemButton>
              </ListItem>
            </Link>
          )
        })}
      </List>
    </div>
  )

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: 1
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                {menuItems.find(item => pathname?.startsWith(item.path))?.text || 'Dashboard'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => toggleTheme()} color="inherit" title={`Alternar para tema ${mode === 'light' ? 'escuro' : 'claro'}`}>
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user?.name}
              </Typography>
              <IconButton onClick={handleMenuOpen} size="small">
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', bgcolor: 'background.default' }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ProtectedRoute>
  )
}
