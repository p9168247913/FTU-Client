// import { Box, Grid } from '@chakra-ui/react';

// // Custom components
// import Banner from 'views/admin/profile/components/Banner';
// import General from 'views/admin/profile/components/General';
// import Notifications from 'views/admin/profile/components/Notifications';
// import Projects from 'views/admin/profile/components/Projects';
// import Storage from 'views/admin/profile/components/Storage';
// import Upload from 'views/admin/profile/components/Upload';

// // Assets
// import banner from 'assets/img/auth/banner.png';
// import avatar from 'assets/img/avatars/USER_LOGO.webp';
// import React from 'react';

// export default function Overview() {
//   const user = {
//     name: localStorage.getItem('name') || 'User',
//     email: localStorage.getItem('email') || 'example@example.com',
//     username: localStorage.getItem('username') || 'username',
//     role: localStorage.getItem('role') || 'role',
//   };
//   return (
//     <Box pt={{ base: '140px', md: '90px', xl: '90px', sm: '100px' }}
//     px={{ base: '4', md: '8' }}>
//       {/* Main Fields */}
//       <Grid
//         templateColumns={{
//           base: '1fr',
//           lg: '1.34fr 1fr 1.62fr',
//         }}
//         templateRows={{
//           base: 'repeat(3, 1fr)',
//           lg: '1fr',
//         }}
//         gap={{ base: '20px', xl: '20px' }}
//       >
//         <Banner
//           // gridArea="1 / 1 / 2 / 2"
//           margin = 'auto'
//           banner={banner}
//           avatar={avatar}
//           name={user.name}
//           job={`${user.role}`}
//           posts={`${user.email}`}
//           followers={`${user.username}`}
//           following="" // You can replace this with any additional field if necessary
//         />
//         {/* <Storage
//           gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
//           used={25.6}
//           total={50}
//         />
//         <Upload
//           gridArea={{
//             base: "3 / 1 / 4 / 2",
//             lg: "1 / 3 / 2 / 4",
//           }}
//           minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
//           pe='20px'
//           pb={{ base: "100px", lg: "20px" }}
//         /> */}
//       </Grid>
//       {/* <Grid
//         mb='20px'
//         templateColumns={{
//           base: "1fr",
//           lg: "repeat(2, 1fr)",
//           "2xl": "1.34fr 1.62fr 1fr",
//         }}
//         templateRows={{
//           base: "1fr",
//           lg: "repeat(2, 1fr)",
//           "2xl": "1fr",
//         }}
//         gap={{ base: "20px", xl: "20px" }}>
//         <Projects
//           gridArea='1 / 2 / 2 / 2'
//           banner={banner}
//           avatar={avatar}
//           name='Adela Parkson'
//           job='Product Designer'
//           posts='17'
//           followers='9.7k'
//           following='274'
//         />
//         <General
//           gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
//           minH='365px'
//           pe='20px'
//         />
//         <Notifications
//           used={25.6}
//           total={50}
//           gridArea={{
//             base: "3 / 1 / 4 / 2",
//             lg: "2 / 1 / 3 / 3",
//             "2xl": "1 / 3 / 2 / 4",
//           }}
//         />
//       </Grid> */}
//     </Box>
//   );
// }

import {
  Box,
  Grid,
  Flex,
  Avatar,
  Text,
  Button,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { EditIcon, SettingsIcon } from '@chakra-ui/icons';

// Custom components
import Banner from 'views/admin/profile/components/Banner';

// Assets
import banner from 'assets/img/auth/banner.png';
import avatar from 'assets/img/avatars/USER_LOGO.webp';
import React from 'react';

export default function Overview() {
  const user = {
    name: localStorage.getItem('name') || 'User',
    email: localStorage.getItem('email') || 'example@example.com',
    username: localStorage.getItem('username') || 'username',
    role: localStorage.getItem('role') || 'role',
  };

  const cardBg = useColorModeValue('white', 'gray.700');
  const cardTextColor = useColorModeValue('gray.700', 'white');
  const bannerBg = useColorModeValue(
    'linear-gradient(135deg, #90cdf4, #63b3ed, #3182ce)',
    'linear-gradient(135deg, #2c5282, #2a4365, #1a365d)',
  );

  return (
    <Box
      pt={{ base: '140px', md: '90px', xl: '90px', sm: '100px' }}
      px={{ base: '4', md: '8' }}
    >
      {/* Profile Banner */}
      <Flex
        direction="column"
        align="center"
        bg={bannerBg}
        borderRadius="lg"
        p={{ base: 6, md: 8 }}
        mb={6}
        boxShadow="lg"
        position="relative"
      >
        <Avatar
          size="2xl"
          src={avatar}
          alt="User Avatar"
          mb={4}
          boxShadow="lg"
          borderWidth={3}
          borderColor={cardBg}
        />
        <Text fontSize="2xl" fontWeight="bold" color={cardTextColor}>
          {user.name}
        </Text>
        <Text fontSize="lg" color="gray.500" mb={4}>
          {user.role}
        </Text>
        {/* <Flex gap={3}>
          <IconButton
            aria-label="Edit Profile"
            icon={<EditIcon />}
            variant="solid"
            colorScheme="blue"
            boxShadow="sm"
          />
          <IconButton
            aria-label="Settings"
            icon={<SettingsIcon />}
            variant="outline"
            colorScheme="gray"
            boxShadow="sm"
          />
        </Flex> */}
      </Flex>

      {/* Information Cards */}
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={6}
      >
        {/* Email Card */}
        <Box
          bg={cardBg}
          p={4}
          borderRadius="lg"
          boxShadow="sm"
          transition="transform 0.3s ease"
          _hover={{ transform: 'scale(1.03)' }}
        >
          <Text fontWeight="bold" color={cardTextColor}>
            Email
          </Text>
          <Text fontSize="sm" color="gray.500">
            {user.email}
          </Text>
        </Box>

        {/* Username Card */}
        <Box
          bg={cardBg}
          p={4}
          borderRadius="lg"
          boxShadow="sm"
          transition="transform 0.3s ease"
          _hover={{ transform: 'scale(1.03)' }}
        >
          <Text fontWeight="bold" color={cardTextColor}>
            Username
          </Text>
          <Text fontSize="sm" color="gray.500">
            {user.username}
          </Text>
        </Box>

        {/* Role Card */}
        <Box
          bg={cardBg}
          p={4}
          borderRadius="lg"
          boxShadow="sm"
          transition="transform 0.3s ease"
          _hover={{ transform: 'scale(1.03)' }}
        >
          <Text fontWeight="bold" color={cardTextColor}>
            Role
          </Text>
          <Text fontSize="sm" color="gray.500">
            {user.role}
          </Text>
        </Box>
      </Grid>
    </Box>
  );
}
