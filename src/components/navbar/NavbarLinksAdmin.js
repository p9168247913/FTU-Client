// Chakra Imports
import {
  Avatar,
  Button,
  Flex,
  Icon,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
// Custom Components
import { ItemContent } from 'components/menu/ItemContent';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import PropTypes from 'prop-types';
import React from 'react';
import './index.css';
// Assets
import navImage from 'assets/img/layout/Navbar.png';
import { MdNotificationsNone, MdInfoOutline } from 'react-icons/md';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { FaEthereum } from 'react-icons/fa';

import logoWhite from '../../assets/img/aqualogo.png';
import routes from 'routes';
export default function HeaderLinks(props) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  // Chakra Color Mode
  const navbarIcon = useColorModeValue('gray.400', 'white');
  let menuBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorBrand = useColorModeValue('brand.700', 'brand.400');
  const ethColor = useColorModeValue('gray.700', 'white');
  const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
  const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
  const ethBox = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );
  const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');
  const toast = useToast();
  let name = localStorage.getItem('name');

  const handleLogout = () => {
    setTimeout(() => {
      console.log('Logout');
      localStorage.removeItem('token');
      localStorage.removeItem('district');
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('username');
      localStorage.removeItem('role');

      window.location.href = '/auth/sign-in';
      toast({
        title: 'Logged out of your account!',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }, 500);
  };

  return (
    <Flex
      w="100%"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      bg={menuBg}
      p={2}
      borderRadius="25px"
      boxShadow={shadow}
      style={{ zIndex: '9999' }}
      gap={4}
      pl={4}
      pt={3}
    >
      <Flex
        w={{ base: '100%', md: 'auto' }}
        textAlign={{ base: 'center', md: 'left' }}
        justifyContent={{ base: 'center', md: 'center' }}
        gap={2}
        style={{
          animation: 'fadeIn 2s ease-in-out, slideIn 1s ease-out',
        }}
      >
        {/* <Text
          w="max-content"
          color={ethColor}
          fontSize={{ base: 'md', md: 'md' }}
          fontWeight="200"
          fontFamily="'Great Vibes', cursive"
          textAlign="center"
          me="6px"
          style={{
            animation: 'fadeIn 2s ease-in-out, slideIn 1s ease-out',
          }}
          whiteSpace={'wrap'}
          display={'flex'}
        > */}
        {/* <span
            style={{
              display: 'inline-block',
              // animation: 'bounce 2s infinite'
              border: '1px solid #4CAF50',
              padding: '2px',
            }}
          >
            <Image src={logoWhite} alt="logo" width={'15px'} />
          </span>{' '} */}
        {/* <span>Hello, Welcome to </span> */}
        <Image
          src={logoWhite}
          alt="logo"
          width={{ base: '20px', md: '20px' }}
        />
        {/* <span
            style={{
              color: '#4CAF50',
              fontWeight: '400',
              textShadow: '1px 1px 1px teal',
              // border: '1px solid #4CAF50',
            }}
          >
            Aquasense Flowmeter Dashboard
          </span> */}

        <Text
          style={{
            color: 'teal',
            fontWeight: '400',
            textShadow: '1px 1px 1px teal',
          }}
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight="100"
          textAlign={{ base: 'center', md: 'left' }}
          lineHeight="1.2"
        >
          <i>Aquasense Flowmeter Dashboard</i>
        </Text>
        {/* <span
          style={{ display: 'inline-block', animation: 'bounce 2s infinite' }}
        >
          🚀
        </span> */}
        {/* </Text> */}
      </Flex>

      <Flex
        w={{ sm: '100%', md: 'auto' }}
        alignItems="center"
        justifyContent="flex-end"
        flexWrap="wrap"
        gap={{ base: 1, md: 0 }}
      >
        <SidebarResponsive routes={routes} />

        <Menu>
          <MenuButton p="0px">
            <Avatar
              _hover={{ cursor: 'pointer' }}
              color="white"
              name={name}
              bg="#11047A"
              size="sm"
              w="40px"
              h="40px"
            />
          </MenuButton>
          <MenuList
            boxShadow={shadow}
            p="0px"
            mt="10px"
            borderRadius="20px"
            bg={menuBg}
            border="none"
          >
            <Flex w="100%" mb="0px">
              <Text
                ps="20px"
                pt="16px"
                pb="10px"
                w="100%"
                borderBottom="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                fontWeight="700"
                color={textColor}
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                title={`👋 Hey, ${name}`}
              >
                &nbsp;{`👋 Hey, ${name}`}
              </Text>
            </Flex>
            <Flex flexDirection="column" p="10px">
              <MenuItem
                _hover={{ bg: 'none' }}
                _focus={{ bg: 'none' }}
                color="red.400"
                borderRadius="8px"
                px="14px"
                onClick={handleLogout}
              >
                <Text fontSize="sm">Log out</Text>
              </MenuItem>
            </Flex>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
