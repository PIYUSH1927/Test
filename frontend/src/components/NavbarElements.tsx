import { NavLink as Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: light dark;

    /* Light Theme Colors */
    --background: rgba(255, 255, 255, 0.95);
    --text: #4A5568;
    --text-hover: #000000;
    --border: #E2E8F0;
    --button-bg: #000000;
    --button-text: #FFFFFF;
    --button-hover: #3366EE;
    --shadow: rgba(0, 0, 0, 0.1);
    --backdrop: rgba(255, 255, 255, 0.95);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --background: rgba(17, 24, 39, 0.95);
      --text: #D1D5DB;
      --text-hover: #FFFFFF;
      --border: #374151;
      --button-bg: #3366EE;
      --button-text: #FFFFFF;
      --button-hover: #2952BD;
      --shadow: rgba(0, 0, 0, 0.3);
      --backdrop: rgba(17, 24, 39, 0.95);
    }
  }
`;

export const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--background);
  backdrop-filter: blur(10px);
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border);
  z-index: 1000;
  transition: background-color 0.3s ease, border-color 0.3s ease;

    &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 95px; /* Adjust width as needed */
    height: 1px;
    background-color: black;
  }
`;



export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

interface MobileNavProps {
  isOpen: boolean;
}

export const MobileNav = styled.div<MobileNavProps>`
  display: none;
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: var(--background);
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  transform: translateY(${({ isOpen }) => (isOpen ? "0" : "-100%")});
  transition: transform 0.3s ease-in-out, background-color 0.3s ease;

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index:100;
  }
`;

export const NavLink = styled(Link)`
  color: var(--text);
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--text-hover);
  }

  &.active {
    color: var(--text-hover);
    font-weight: 600;
  }
`;

export const AuthButton = styled.button`
  background-color: var(--button-bg);
  color: var(--button-text);
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;


  &:hover {
    background-color: var(--button-hover);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px var(--shadow);
  }
`;

export const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: var(--text-hover);
  }

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

export const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const ScrollLink = styled.button`
  color: var(--text);
  background: none;
  border: none;
  font-size: inherit;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: color 0.2s ease;
  text-align: left;

  &:hover {
    color: var(--text-hover);
  }

  &.active {
    color: var(--text-hover);
    font-weight: 600;
  }
`;

interface LogoContainerProps {
  theme: string;
}

export const LogoContainer = styled.div<LogoContainerProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
    filter: ${({ theme }) => (theme === "dark" ? "invert(1)" : "none")};
  }

  span {
    font-weight: bold;
    font-size: 1rem;
    color: var(--text-hover);
  }
`;
