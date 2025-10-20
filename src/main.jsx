import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/GlobalStyles.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import Router from './router/Router.jsx';
import NavBarWrapper from './components/navbar/NavBarWrapper.jsx';

function AppLayout() {
 
  const location = useLocation();


  const hideNavbarRoutes = ['/'];
  
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
     {/* Se shouldHideNavBar for falso então ele renderiza o componente navBar, se for verdadeiro ele não renderiza */}
      {!shouldHideNavbar && <NavBarWrapper />} 
      <Router />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </StrictMode>
);
