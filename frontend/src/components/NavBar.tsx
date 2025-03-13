import React, { useState, useEffect } from "react";
import { Menu, Close } from "@mui/icons-material"; 
import { useLocation, useNavigate, Link} from "react-router-dom";
import styled from "styled-components";
import {
    GlobalStyle,
    Nav,
    NavMenu,
    LogoContainer,
    AuthButton,
    MenuButton,
    NavControls,
    ScrollLink,
    MobileNav
} from "./NavbarElements";

import SooruAILogo from '../SooruAI.png';

interface MobileNavProps {
    isOpen: boolean;
}


const SooruLogo: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(darkModeQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        darkModeQuery.addEventListener('change', handler);
        return () => darkModeQuery.removeEventListener('change', handler);
    }, []);

    const handleLogoClick = (): void => {
        if (location.pathname !== '/') {
            navigate('/');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <LogoContainer theme={isDarkMode ? 'dark' : 'light'} onClick={handleLogoClick}>
            <img src={SooruAILogo} alt="Sooru.AI Logo"/>
        </LogoContainer>
    );
};

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage: boolean = location.pathname === '/';

    useEffect(() => {
        // If we're on the home page, get the current hash for active section
        if (isHomePage) {
            const currentSection = window.location.hash.replace('#', '');
        }
    }, [location, isHomePage]);


    const handleNavigation = (sectionId: string): void => {
      setIsOpen(false);
        if (sectionId === 'projects') {
            navigate('/projects');
        } else {
            if (isHomePage) {
                // If on home page, scroll to the section
                const element = document.getElementById(sectionId);
                if (element) {
                    const navHeight = 70;  // Account for navbar height
                    const elementPosition = element.offsetTop - navHeight;
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                 
                }
            } else {
                // Navigate back to home and scroll to the section
                navigate('/', { state: { scrollTo: sectionId } });
                setTimeout(() => {
                    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        }
    };

    const handleAuth = (): void => {
        if (location.pathname === '/LoginPage') {
            navigate('/');
        } else {
            navigate('/LoginPage');
        }
    };

    const navItems: { id: string; label: string }[] = [
        { id: 'projects', label: 'Projects' },
        { id: 'about', label: 'About' },
        { id: 'features', label: 'Features' },
        { id: 'contact', label: 'Contact Us' }
    ];

    return (
        <>
            <GlobalStyle />
            <Nav>
                <div className="logo-link">
                    <SooruLogo />
                </div>

                <NavMenu>
                    {navItems.map((item) => (
                        <ScrollLink
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
                        >
                            {item.label}
                        </ScrollLink>
                    ))}
                </NavMenu>


                <NavControls>
                    <AuthButton as="button" onClick={handleAuth}>
                        {location.pathname === '/LoginPage' ? 'Back to Home' : 'Login / Register'}
                    </AuthButton>
                    <MenuButton onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <Close fontSize="large" /> : <Menu fontSize="large" />}
                    </MenuButton>
                </NavControls>
            </Nav>
            
  
            <MobileNav isOpen={isOpen}>
                {navItems.map((item) => (
                    <ScrollLink
                        key={item.id}
                        onClick={(e) => { 
                            handleNavigation(item.id);  // Trigger navigation
                            e.preventDefault();  // Prevent default behavior to avoid page refresh or other issues
                        }}
                    >
                        {item.label}
                    </ScrollLink>
                ))}
            </MobileNav>
        </>
    );
};

export default Navbar;
