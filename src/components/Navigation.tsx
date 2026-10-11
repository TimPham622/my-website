import React, { useEffect, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import List from '@mui/material/List';
import ListIcon from '@mui/icons-material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { useContent } from '../content/ContentProvider';

const drawerWidth = 240;
const NAV_OFFSET = 78;

function Navigation({parentToChild, modeChange, isBlogPage = false}: any) {
  const { content } = useContent();
  const navItems = content.navigation.items;
  const siteBase = process.env.PUBLIC_URL || (window.location.pathname.startsWith('/my-website') ? '/my-website' : '');

  const {mode} = parentToChild;

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("navigation");
      if (navbar) {
        const scrolled = window.scrollY > navbar.clientHeight;
        setScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (section: string) => {
    const sectionElement = document.getElementById(section);

    if (sectionElement) {
      const yOffset = sectionElement.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: yOffset, behavior: 'smooth' });
      window.history.replaceState(null, '', `#${section}`);
    }
  };

  const navHref = (section: string) => section === 'blog'
    ? `${siteBase}/blog/`
    : isBlogPage ? `${siteBase}/#${section}` : `#${section}`;

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    if (section === 'blog' || isBlogPage) return;
    event.preventDefault();
    scrollToSection(section);
  };

  const drawer = (
    <Box className="navigation-bar-responsive" onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <p className="mobile-menu-top"><ListIcon/>Menu</p>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.section} disablePadding>
            <ListItemButton
              component="a"
              href={navHref(item.section)}
              sx={{ textAlign: 'center' }}
              onClick={(event) => handleNavClick(event, item.section)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box className="navigation-shell" sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" id="navigation" className={`navbar-fixed-top${scrolled ? ' scrolled' : ''}`}>
        <Toolbar className='navigation-bar'>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            className="mode-toggle"
            color="inherit"
            aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
            onClick={() => modeChange()}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            {navItems.map((item) => (
              <Button
                key={item.section}
                href={navHref(item.section)}
                onClick={(event) => handleNavClick(event, item.section)}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

export default Navigation;
