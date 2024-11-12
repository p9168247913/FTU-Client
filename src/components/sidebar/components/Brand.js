import React from 'react';

// Chakra imports
import { Flex, Image, useColorModeValue } from '@chakra-ui/react';

// Custom components
import { HorizonLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';
import CompanyLogo from 'assets/img/main_logo copy.png';
export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');

  return (
    <Flex align="center" direction="column">
      {/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
      <Image
        src={CompanyLogo}
        alt="Company Logo"
        h="56px"
        w="175px"
        my="32px"
      />

      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
