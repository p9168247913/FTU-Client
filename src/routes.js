import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdInsights,
  MdPeople,
  MdBusiness,
  MdDevices,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import Users from 'views/admin/users';
import Analytics from 'views/admin/analytics';
import Company from 'views/admin/company';
import Device from 'views/admin/device';
// import Analytics from 'views/admin/analytics';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  // {
  //   name: 'Analytics',
  //   layout: '/admin',
  //   path: '/analytics',
  //   icon: (
  //     <Icon
  //       as={MdOutlineShoppingCart}
  //       width="20px"
  //       height="20px"
  //       color="inherit"
  //     />
  //   ),
  //   component: <Analytics />,
  //   secondary: true,
  // },

  {
    name: 'Analytics',
    layout: '/admin',
    path: '/analytics',
    icon: <Icon as={MdInsights} width="20px" height="20px" color="inherit" />,
    component: <Analytics />,
    secondary: true,
  },
  {
    name: 'Company',
    layout: '/admin',
    path: '/company',
    icon: <Icon as={MdBusiness} width="20px" height="20px" color="inherit" />,
    component: <Company />,
    secondary: true,
  },
  {
    name: 'Devices',
    layout: '/admin',
    path: '/devices',
    icon: <Icon as={MdDevices} width="20px" height="20px" color="inherit" />,
    component: <Device />,
    secondary: true,
  },
  {
    name: 'Users',
    layout: '/admin',
    path: '/users',
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <Users />,
    secondary: true,
  },
  {
    name: 'Data Tables',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
    component: <DataTables />,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export default routes;
