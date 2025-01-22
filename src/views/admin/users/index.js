import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  // Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Avatar,
  IconButton,
  useDisclosure,
  useToast,
  Text,
  HStack,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import axiosInstance from 'axiosInstance';
import baseUrl from 'Base_Url/baseUrl';
import Swal from 'sweetalert2';
import Pagination from '@choc-ui/paginator';
import { AddIcon } from '@chakra-ui/icons';
import DevelopmentTable from './tables/DevelopmentTable';
import { SearchIcon } from '@chakra-ui/icons';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { useColorModeValue } from '@chakra-ui/react';
import Select from 'react-select';
import { set } from 'date-fns';
import { EmailIcon, PhoneIcon } from '@chakra-ui/icons';
import {
  FaUserAlt,
  FaBuilding,
  FaIdBadge,
  FaInfoCircle,
  FaUserTie,
  FaPhoneAlt,
  FaClipboardList,
  FaUser,
  FaUserCircle,
  FaLock,
  FaBriefcase,
  FaUserTag,
} from 'react-icons/fa';
import { MdDevices } from 'react-icons/md';
import { use } from 'react';

const User = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [addUser, setAddUser] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: '',
    designation: '',
    phoneNo: '',
    companyId: '',
  });
  const [page, setPage] = useState(1);
  const [totalResult, setTotalResult] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [device, setDevice] = useState([]);
  const [viewUser, setViewUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalBg = useColorModeValue('white', 'gray.800');
  const [companyData, setCompanyData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCompany2, setSelectedCompany2] = useState({
    label: '',
    value: '',
  });
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const toast = useToast();
  const Token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [searchTerm, setSearchTerm] = useState({
    name: '',
    email: '',
    username: '',
    companyId: '',
  });
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputTextColor = useColorModeValue('black', 'white');
  const inputPlaceholderColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBorderColor = useColorModeValue('gray.400', 'gray.500');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');
  const focusBorderColor = useColorModeValue('blue.500', 'blue.300');
  const selectedBg = useColorModeValue('#EDF2F7', '#2D3748');
  const focusedBg = useColorModeValue('#E2E8F0', '#4A5568');
  const headerBg = useColorModeValue(
    'linear-gradient(90deg, #4299E1 0%, #3182CE 50%, #2B6CB0 100%)',
    'linear-gradient(90deg, #2C5282 0%, #2A4365 50%, #1A365D 100%)',
  );

  const textColor = useColorModeValue('gray.700', 'gray.300');
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const addmodalheaderBg = useColorModeValue(
    'linear-gradient(90deg,rgb(34, 84, 157) 0%,rgb(60, 129, 159) 50%,rgb(93, 153, 156) 100%)',
    'linear-gradient(90deg,rgb(39, 205, 230) 0%,rgb(81, 198, 224) 50%,rgb(136, 218, 236) 100%)',
  );
  const companyOptions = [
    { value: '', label: 'Select Company' },
    ...companyData.map((company) => ({
      value: company._id,
      label: company.name,
    })),
  ];
  const getQueryString = (params) => {
    return Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== '')
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
  };

  const getCompanyList = async () => {
    try {
      const response = await axiosInstance.get(`${baseUrl}/company/list`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      if (response) {
        const data = response?.data?.data?.data;

        setCompanyData(response?.data?.data?.data);
        if (role === 'companyUser' || (role === 'user' && data?.length === 1)) {
          setSelectedCompany(data[0]?._id);
          setSelectedCompany2({
            label: data[0]?.name,
            value: data[0]?._id,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCompanyList();
  }, []);

  const getUsers = async () => {
    try {
      setLoading(true);
      const queryParams = {
        page: page ? page : 1,
        limit: rowsPerPage,
      };
      let filter = {};

      if (
        searchTerm &&
        (searchTerm.name ||
          searchTerm.email ||
          searchTerm.username ||
          searchTerm.companyId)
      ) {
        filter = {
          ...filter,
          ...searchTerm,
        };
      }

      if (Object.keys(filter).length > 0) {
        queryParams.filter = JSON.stringify(filter);
      }
      const response = await axiosInstance.get(
        `${baseUrl}/auth/users?${getQueryString(queryParams)}`,
        {
          headers: { Authorization: `Bearer ${Token}` },
        },
      );
      setUsers(response?.data?.data?.data || []);
      setPage(response?.data?.data?.page);
      setTotalResult(response?.data?.data?.totalResults);
      setTotalPages(response?.data?.data?.totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: 'Failed to load users',
        description: error?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await axiosInstance.get(`${baseUrl}/company/list`, {
        headers: { Authorization: `Bearer ${Token}` },
      });
      setCompanies(response?.data?.data?.data || []);
    } catch (error) {
      console.error('Error in getting company data', error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    getAllDeviceList();
  }, [page, rowsPerPage]);

  useEffect(() => {
    getUsers();
  }, [page, rowsPerPage, searchTerm]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.put(
            `${baseUrl}/auth/deleteUser/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${Token}`,
              },
            },
          );

          if (response.status === 200) {
            getUsers();
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
          } else {
            Swal.fire('Error!', 'Failed to delete the user.', 'error');
          }
        } catch (error) {
          Swal.fire(
            'Error!',
            error?.response?.data?.data
              ? error?.response?.data?.data
              : error?.response?.data?.message,
            'error',
          );
        }
      }
    });
  };
  const handleEditUser = (user) => {
    const assignedDevices = user.assignedDevices.map((device) => device._id);
    setEditUser({ ...user, assignedDevices });
    onEditOpen();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        name: editUser.name,
        email: editUser.email,
        username: editUser.username,
        role: editUser.role,
        designation: editUser.designation,
        phoneNo: editUser.phoneNo,
        assignedDevices: editUser?.assignedDevices,
      };

      if (editUser?.password) {
        payload.password = editUser.password;
      }
      if (editUser?.companyId?._id) {
        payload.companyId = editUser.companyId._id;
      }

      const response = await axiosInstance.put(
        `/auth/updateUser/${editUser._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === editUser._id ? { ...user, ...editUser } : user,
          ),
        );
        onEditClose();
        getUsers();
        toast({
          title: 'User updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast({
        title:
          error?.response?.data?.message ||
          error?.response?.data?.data ||
          'Error updating user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddUser = async () => {
    setLoading(true);

    const payload = {
      name: addUser.name,
      email: addUser.email,
      username: addUser.username,
      password: addUser.password,
      role: addUser.role,
      designation: addUser.designation,
      phoneNo: addUser.phoneNo,
    };

    if (addUser?.companyId) {
      payload.companyId = addUser.companyId;
    }

    try {
      const response = await axiosInstance.post(
        `${baseUrl}/auth/register`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      if (response) {
        setLoading(false);
        onClose();
        toast({
          title: 'User added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        getUsers();
        setAddUser({
          name: '',
          email: '',
          username: '',
          password: '',
          role: '',
          district: '',
          designation: '',
          companyId: '',
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: error?.response?.data?.data
          ? error?.response?.data?.data
          : error?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRowClick = (user) => {
    setViewUser(user);
    onViewOpen();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchTerm((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const getAllDeviceList = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${baseUrl}/device/device-list`,
        { headers: { Authorization: `Bearer ${Token}` } },
      );
      const data = response.data.data;
      setDevice(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: error.response.data.message || 'Failed to load devices',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const addRoleOptions = {
    admin: [
      { value: '', label: 'Select Role' },
      { value: 'admin', label: 'Admin' },
      { value: 'sales', label: 'Sales' },
      { value: 'IRM', label: 'IRM' },
      { value: 'FSE', label: 'FSE' },
      { value: 'user', label: 'User' },
      { value: 'companyUser', label: 'Company Admin' },
    ],
    IRM: [
      { value: '', label: 'Select Role' },
      { value: 'sales', label: 'Sales' },
      { value: 'IRM', label: 'IRM' },
      { value: 'FSE', label: 'FSE' },
      { value: 'user', label: 'User' },
      { value: 'companyUser', label: 'Company Admin' },
    ],
    companyUser: [
      { value: '', label: 'Select Role' },
      { value: 'user', label: 'User' },
    ],
  };

  const handleCompanyChange = (selectedOption) => {
    setPage(1);
    setSearchTerm({ ...searchTerm, companyId: selectedOption.value });
  };

  return (
    <Box
      pt={{ base: '140px', md: '90px', xl: '90px', sm: '100px' }}
      px={{ base: '4', md: '8' }}
    >
      <Flex
        mb="5"
        justifyContent={{ base: 'center', md: 'space-between' }}
        alignItems="center"
        flexDirection={{ base: 'column', md: 'row' }}
        gap={{ base: 4, md: 0 }}
      >
        <HStack
          spacing={3}
          mb={{ base: 3, md: 0 }}
          width="100%"
          flexWrap="wrap"
          gap={3}
        >
          <InputGroup width={{ base: '100%', sm: '100%', md: 'auto' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              borderRadius={20}
              placeholder="Search by name"
              value={searchTerm.name}
              onChange={(e) =>
                setSearchTerm({ ...searchTerm, name: e.target.value })
              }
              bg={useColorModeValue('white', 'gray.700')}
              color={useColorModeValue('black', 'white')}
              _placeholder={{
                color: useColorModeValue('gray.500', 'gray.400'),
              }}
            />
          </InputGroup>

          <InputGroup width={{ base: '100%', sm: '100%', md: 'auto' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              borderRadius={20}
              placeholder="Search by email"
              value={searchTerm.email}
              onChange={(e) =>
                setSearchTerm({ ...searchTerm, email: e.target.value })
              }
              bg={useColorModeValue('white', 'gray.700')}
              color={useColorModeValue('black', 'white')}
              _placeholder={{
                color: useColorModeValue('gray.500', 'gray.400'),
              }}
            />
          </InputGroup>

          {/* <InputGroup width={{ base: '100%', sm: '100%', md: 'auto' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              borderRadius={20}
              placeholder="Search by username"
              value={searchTerm.username}
              onChange={(e) =>
                setSearchTerm({ ...searchTerm, username: e.target.value })
              }
              bg={useColorModeValue('white', 'gray.700')}
              color={useColorModeValue('black', 'white')}
              _placeholder={{
                color: useColorModeValue('gray.500', 'gray.400'),
              }}
            />
          </InputGroup> */}

          <Select
            options={companyOptions}
            value={companyOptions.find(
              (option) => option.value === selectedCompany,
            )}
            onChange={(selectedOption) => {
              handleCompanyChange(selectedOption);
            }}
            placeholder="Select Company"
            isSearchable
            styles={{
              container: (base) => ({
                ...base,
                width: ['100%', '100%', '40%'],
                bgColor: 'gray.100',
                zIndex: 999,
              }),
              control: (base) => ({
                ...base,
                backgroundColor: inputBg,
                color: inputTextColor,
                borderColor: borderColor,
                borderRadius: '20px',
                boxShadow: 'none',
                '&:hover': {
                  borderColor: hoverBorderColor,
                },
                zIndex: 5,
              }),
              singleValue: (base) => ({
                ...base,
                color: inputTextColor,
              }),
              input: (base) => ({
                ...base,
                color: inputTextColor,
              }),
              placeholder: (base) => ({
                ...base,
                color: placeholderColor,
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: inputBg,
                maxHeight: '200px',
                // overflowY: 'auto',
              }),
              menuList: (base) => ({
                ...base,
                backgroundColor: inputBg,
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected
                  ? selectedBg
                  : isFocused
                  ? focusedBg
                  : 'transparent',
                color: inputTextColor,
                '&:hover': {
                  backgroundColor: selectedBg,
                },
              }),
            }}
          />
        </HStack>
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={onOpen}
          width={{ base: '100%', md: 'auto' }}
        >
          Add User
        </Button>
      </Flex>

      <DevelopmentTable
        tableData={users}
        handleEditUser={handleEditUser}
        handleDeleteUser={(id) => handleDelete(id)}
        handlePageChange={handlePageChange}
        handleRowClick={handleRowClick} // Pass the function here
        page={page}
        totalPages={totalPages}
        loading={loading}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent maxWidth="900px" bg={modalBg} rounded="xl" boxShadow="lg">
          <Box
            bg={addmodalheaderBg}
            py={1}
            px={2}
            textAlign="center"
            roundedTop="xl"
          >
            <ModalHeader
              fontSize="2xl"
              fontWeight="bold"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={AddIcon} mr={2} />
              Add New User
            </ModalHeader>
            <ModalCloseButton color="white" />
          </Box>

          <ModalBody p={6}>
            <Box mb={8}>
              <Flex alignItems="center" mb={4}>
                <Icon as={FaInfoCircle} w={6} h={6} color="blue.500" mr={2} />
                <Text fontSize="lg" fontWeight="semibold">
                  Basic Details
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaUser} />
                    </InputLeftElement>
                    <Input
                      name="name"
                      placeholder="Enter user name"
                      value={addUser.name}
                      onChange={(e) =>
                        setAddUser({ ...addUser, name: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('black', 'white')}
                      borderRadius="md"
                      borderWidth="2px"
                      borderColor={useColorModeValue('gray.300', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('blue.400', 'blue.600'),
                      }}
                      _focus={{
                        borderColor: useColorModeValue('blue.500', 'blue.300'),
                        boxShadow: 'outline',
                      }}
                      _placeholder={{
                        color: useColorModeValue('gray.500', 'gray.400'),
                      }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm">Username</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaUserCircle} />
                    </InputLeftElement>
                    <Input
                      name="username"
                      placeholder="Enter username"
                      value={addUser.username}
                      onChange={(e) =>
                        setAddUser({ ...addUser, username: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('black', 'white')}
                      borderRadius="md"
                      borderWidth="2px"
                      borderColor={useColorModeValue('gray.300', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('blue.400', 'blue.600'),
                      }}
                      _focus={{
                        borderColor: useColorModeValue('blue.500', 'blue.300'),
                        boxShadow: 'outline',
                      }}
                      _placeholder={{
                        color: useColorModeValue('gray.500', 'gray.400'),
                      }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm">Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaLock} />
                    </InputLeftElement>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      value={addUser.password}
                      onChange={(e) =>
                        setAddUser({ ...addUser, password: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('black', 'white')}
                      borderRadius="md"
                      borderWidth="2px"
                      borderColor={useColorModeValue('gray.300', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('blue.400', 'blue.600'),
                      }}
                      _focus={{
                        borderColor: useColorModeValue('blue.500', 'blue.300'),
                        boxShadow: 'outline',
                      }}
                      _placeholder={{
                        color: useColorModeValue('gray.500', 'gray.400'),
                      }}
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </Box>

            <Box mb={8}>
              <Flex alignItems="center" mb={4}>
                <Icon as={FaPhoneAlt} w={6} h={6} color="orange.500" mr={2} />
                <Text fontSize="lg" fontWeight="semibold">
                  Contact Details
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={EmailIcon} />
                    </InputLeftElement>
                    <Input
                      name="email"
                      placeholder="Enter user email"
                      value={addUser.email}
                      onChange={(e) =>
                        setAddUser({ ...addUser, email: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('black', 'white')}
                      borderRadius="md"
                      borderWidth="2px"
                      borderColor={useColorModeValue('gray.300', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('blue.400', 'blue.600'),
                      }}
                      _focus={{
                        borderColor: useColorModeValue('blue.500', 'blue.300'),
                        boxShadow: 'outline',
                      }}
                      _placeholder={{
                        color: useColorModeValue('gray.500', 'gray.400'),
                      }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Phone Number</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaPhoneAlt} />
                    </InputLeftElement>
                    <Input
                      name="phoneNo"
                      placeholder="Enter phone number"
                      value={addUser.phoneNo}
                      onChange={(e) =>
                        setAddUser({ ...addUser, phoneNo: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('black', 'white')}
                      borderRadius="md"
                      borderWidth="2px"
                      borderColor={useColorModeValue('gray.300', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('blue.400', 'blue.600'),
                      }}
                      _focus={{
                        borderColor: useColorModeValue('blue.500', 'blue.300'),
                        boxShadow: 'outline',
                      }}
                      _placeholder={{
                        color: useColorModeValue('gray.500', 'gray.400'),
                      }}
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </Box>

            <Box mb={8}>
              <Flex alignItems="center" mb={4}>
                <Icon as={FaUserTie} w={6} h={6} color="teal.500" mr={2} />
                <Text fontSize="lg" fontWeight="semibold">
                  Role and Designation
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
                <FormControl isRequired>
                  <FormLabel fontSize="sm">Role</FormLabel>

                  <Select
                    options={addRoleOptions[role]}
                    placeholder="Select role"
                    value={addRoleOptions[role].find(
                      (option) => option.value === addUser.role,
                    )}
                    onChange={(selectedOption) =>
                      setAddUser({ ...addUser, role: selectedOption.value })
                    }
                    bg={useColorModeValue('white', 'gray.700')}
                    color={useColorModeValue('black', 'white')}
                    borderRadius="md"
                    pl="10"
                    borderWidth="2px"
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    _hover={{
                      borderColor: useColorModeValue('blue.400', 'blue.600'),
                    }}
                    _focus={{
                      borderColor: useColorModeValue('blue.500', 'blue.300'),
                      boxShadow: 'outline',
                    }}
                    _placeholder={{
                      color: useColorModeValue('gray.500', 'gray.400'),
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Designation</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaBriefcase} />
                    </InputLeftElement>
                    <Input
                      name="designation"
                      placeholder="Enter designation"
                      value={addUser.designation}
                      onChange={(e) =>
                        setAddUser({ ...addUser, designation: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('black', 'white')}
                      borderRadius="md"
                      borderWidth="2px"
                      borderColor={useColorModeValue('gray.300', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('blue.400', 'blue.600'),
                      }}
                      _focus={{
                        borderColor: useColorModeValue('blue.500', 'blue.300'),
                        boxShadow: 'outline',
                      }}
                      _placeholder={{
                        color: useColorModeValue('gray.500', 'gray.400'),
                      }}
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </Box>

            {addUser.role === 'companyUser' || addUser.role === 'user' ? (
              <Box mb={8}>
                <Flex alignItems="center" mb={4}>
                  <Icon as={FaBuilding} w={6} h={6} color="purple.500" mr={2} />
                  <Text fontSize="lg" fontWeight="semibold">
                    Company Association
                  </Text>
                </Flex>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
                  <FormControl>
                    <FormLabel fontSize="sm">Company</FormLabel>
                    <Select
                      options={companies.map((company) => ({
                        value: company._id,
                        label: company.name,
                      }))}
                      placeholder="Select company"
                      value={
                        addUser.companyId
                          ? {
                              value: addUser.companyId,
                              label: companies.find(
                                (c) => c._id === addUser.companyId,
                              )?.name,
                            }
                          : null
                      }
                      onChange={(selectedOption) =>
                        setAddUser({
                          ...addUser,
                          companyId: selectedOption ? selectedOption.value : '',
                        })
                      }
                      bg={inputBg}
                      color={inputTextColor}
                      borderRadius="md"
                      borderWidth="2px"
                      borderColor={inputBorderColor}
                      _hover={{ borderColor: hoverBorderColor }}
                      _focus={{
                        borderColor: focusBorderColor,
                        boxShadow: 'outline',
                      }}
                      _placeholder={{ color: placeholderColor }}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>
            ) : null}
          </ModalBody>

          <ModalFooter
            bg={useColorModeValue('gray.50', 'gray.800')}
            borderTop="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            py={5}
            px={6}
            justifyContent="space-between"
            roundedBottom="xl"
          >
            <Button
              onClick={onClose}
              variant="ghost"
              colorScheme="red"
              borderRadius="md"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              colorScheme="blue"
              isLoading={loading}
              borderRadius="md"
              shadow="sm"
              _hover={{ shadow: 'md', transform: 'translateY(-1px)' }}
            >
              Add User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalOverlay />
        <ModalContent maxWidth="900px" bg={modalBg} rounded="xl" boxShadow="lg">
          <Box
            bg={addmodalheaderBg}
            py={1}
            px={2}
            textAlign="center"
            roundedTop="xl"
          >
            <ModalHeader
              fontSize="2xl"
              fontWeight="bold"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={EditIcon} mr={2} />
              Edit User
            </ModalHeader>
            <ModalCloseButton color="white" />
          </Box>

          <ModalBody p={6}>
            <Box mb={8}>
              <Flex alignItems="center" mb={4}>
                <Icon as={FaInfoCircle} w={6} h={6} color="blue.500" mr={2} />
                <Text fontSize="lg" fontWeight="semibold">
                  Basic Details
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
                <FormControl>
                  <FormLabel fontSize="sm">Name</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaUser} />
                    </InputLeftElement>
                    <Input
                      name="name"
                      placeholder="Enter name"
                      value={editUser?.name || ''}
                      onChange={(e) =>
                        setEditUser({ ...editUser, name: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('black', 'white')}
                      borderRadius="md"
                      borderWidth="2px"
                      borderColor={useColorModeValue('gray.300', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('blue.400', 'blue.600'),
                      }}
                      _focus={{
                        borderColor: useColorModeValue('blue.500', 'blue.300'),
                        boxShadow: 'outline',
                      }}
                      _placeholder={{
                        color: useColorModeValue('gray.500', 'gray.400'),
                      }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaUserCircle} />
                    </InputLeftElement>
                    <Input
                      name="username"
                      value={editUser?.username || ''}
                      onChange={(e) =>
                        setEditUser({ ...editUser, username: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('black', 'white')}
                      _placeholder={{
                        color: useColorModeValue('gray.500', 'gray.400'),
                      }}
                      borderWidth="2px"
                      borderColor={useColorModeValue('gray.300', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('blue.400', 'blue.600'),
                      }}
                      _focus={{
                        borderColor: useColorModeValue('blue.500', 'blue.300'),
                        boxShadow: 'outline',
                      }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaLock} />
                    </InputLeftElement>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Leave blank to keep unchanged"
                      onChange={(e) =>
                        setEditUser({ ...editUser, password: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('black', 'white')}
                      _placeholder={{
                        color: useColorModeValue('gray.500', 'gray.400'),
                      }}
                      borderWidth="2px"
                      borderColor={useColorModeValue('gray.300', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('blue.400', 'blue.600'),
                      }}
                      _focus={{
                        borderColor: useColorModeValue('blue.500', 'blue.300'),
                        boxShadow: 'outline',
                      }}
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </Box>

            <Box mb={8}>
              <Flex alignItems="center" mb={4}>
                <Icon as={FaPhoneAlt} w={6} h={6} color="orange.500" mr={2} />
                <Text fontSize="lg" fontWeight="semibold">
                  Contact Details
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
                <FormControl>
                  <FormLabel fontSize="sm">Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={EmailIcon} />
                    </InputLeftElement>
                    <Input
                      name="email"
                      placeholder="Enter email"
                      value={editUser?.email || ''}
                      onChange={(e) =>
                        setEditUser({ ...editUser, email: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('black', 'white')}
                      borderRadius="md"
                      borderWidth="2px"
                      borderColor={useColorModeValue('gray.300', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('blue.400', 'blue.600'),
                      }}
                      _focus={{
                        borderColor: useColorModeValue('blue.500', 'blue.300'),
                        boxShadow: 'outline',
                      }}
                      _placeholder={{
                        color: useColorModeValue('gray.500', 'gray.400'),
                      }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Phone Number</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaPhoneAlt} />
                    </InputLeftElement>
                    <Input
                      name="phoneNo"
                      placeholder="Enter phone number"
                      value={editUser?.phoneNo || ''}
                      onChange={(e) =>
                        setEditUser({ ...editUser, phoneNo: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('black', 'white')}
                      borderRadius="md"
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </Box>

            <Box mb={8}>
              <Flex alignItems="center" mb={4}>
                <Icon as={FaUserTie} w={6} h={6} color="teal.500" mr={2} />
                <Text fontSize="lg" fontWeight="semibold">
                  Role and Designation
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="6">
                <FormControl>
                  <FormLabel fontSize="sm">Role</FormLabel>
                  <Select
                    options={addRoleOptions[role]}
                    placeholder="Select role"
                    value={addRoleOptions[role].find(
                      (option) => option.value === editUser?.role,
                    )}
                    onChange={(selectedOption) =>
                      setEditUser({ ...editUser, role: selectedOption.value })
                    }
                    bg={useColorModeValue('white', 'gray.700')}
                    color={useColorModeValue('black', 'white')}
                    borderRadius="md"
                    borderWidth="2px"
                    borderColor={useColorModeValue('gray.300', 'gray.600')}
                    _hover={{
                      borderColor: useColorModeValue('blue.400', 'blue.600'),
                    }}
                    _focus={{
                      borderColor: useColorModeValue('blue.500', 'blue.300'),
                      boxShadow: 'outline',
                    }}
                    _placeholder={{
                      color: useColorModeValue('gray.500', 'gray.400'),
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm">Designation</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaBriefcase} />
                    </InputLeftElement>
                    <Input
                      name="designation"
                      placeholder="Enter designation"
                      value={editUser?.designation || ''}
                      onChange={(e) =>
                        setEditUser({
                          ...editUser,
                          designation: e.target.value,
                        })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('black', 'white')}
                      borderRadius="md"
                      borderWidth="2px"
                      borderColor={useColorModeValue('gray.300', 'gray.600')}
                      _hover={{
                        borderColor: useColorModeValue('blue.400', 'blue.600'),
                      }}
                      _focus={{
                        borderColor: useColorModeValue('blue.500', 'blue.300'),
                        boxShadow: 'outline',
                      }}
                      _placeholder={{
                        color: useColorModeValue('gray.500', 'gray.400'),
                      }}
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>
            </Box>

            {editUser?.role === 'companyUser' || editUser?.role === 'user' ? (
              <Box mb={8}>
                <Flex alignItems="center" mb={4}>
                  <Icon as={FaBuilding} w={6} h={6} color="purple.500" mr={2} />
                  <Text fontSize="lg" fontWeight="semibold">
                    Company Association
                  </Text>
                </Flex>
                <FormControl>
                  <FormLabel fontSize="sm">Company</FormLabel>
                  <Select
                    options={companies.map((company) => ({
                      value: company._id,
                      label: company.name,
                    }))}
                    placeholder="Select company"
                    value={
                      editUser?.companyId
                        ? {
                            value: editUser.companyId._id,
                            label: companies.find(
                              (c) => c._id === editUser.companyId._id,
                            )?.name,
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      setEditUser({
                        ...editUser,
                        companyId: selectedOption
                          ? {
                              _id: selectedOption.value,
                              name: selectedOption.label,
                            }
                          : null,
                      })
                    }
                    bg={inputBg}
                    color={inputTextColor}
                    borderRadius="md"
                  />
                </FormControl>
              </Box>
            ) : null}

            {editUser?.role === 'user' || editUser?.role === 'companyUser' ? (
              <Box mb={8}>
                <Flex alignItems="center" mb={4}>
                  <Icon
                    as={FaClipboardList}
                    w={6}
                    h={6}
                    color="green.500"
                    mr={2}
                  />
                  <Text fontSize="lg" fontWeight="semibold">
                    Assigned Devices
                  </Text>
                </Flex>
                <FormControl>
                  <FormLabel fontSize="sm">Devices</FormLabel>
                  <Select
                    isMulti
                    options={device.map((dev) => ({
                      value: dev._id,
                      label: `${dev.productName} (${dev.productId})`,
                    }))}
                    value={
                      editUser?.assignedDevices?.map((id) => {
                        const matchedDevice = device.find(
                          (dev) => dev._id === id,
                        );
                        return {
                          value: id,
                          label: `${matchedDevice?.productName || ''} (${
                            matchedDevice?.productId || ''
                          })`,
                        };
                      }) || []
                    }
                    onChange={(selectedOptions) => {
                      const selectedDeviceIds = selectedOptions.map(
                        (option) => option.value,
                      );
                      setEditUser({
                        ...editUser,
                        assignedDevices: selectedDeviceIds,
                      });
                    }}
                    bg={inputBg}
                    color={inputTextColor}
                    borderRadius="md"
                  />
                </FormControl>
              </Box>
            ) : null}
          </ModalBody>

          <ModalFooter
            bg={useColorModeValue('gray.50', 'gray.800')}
            borderTop="1px solid"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            py={5}
            px={6}
            justifyContent="space-between"
            roundedBottom="xl"
          >
            <Button
              onClick={onEditClose}
              variant="ghost"
              colorScheme="red"
              borderRadius="md"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              colorScheme="blue"
              isLoading={loading}
              borderRadius="md"
              shadow="sm"
              _hover={{ shadow: 'md', transform: 'translateY(-1px)' }}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent
          maxWidth="800px"
          mx="auto"
          rounded="lg"
          shadow="lg"
          overflow="hidden"
        >
          <Box bg={headerBg} color="white" py={6} textAlign="center">
            <Flex justify="center" mb={4}>
              <Avatar size="2xl" name={viewUser?.name || 'N/A'} />
            </Flex>
            <Text fontSize="2xl" fontWeight="bold">
              {viewUser?.name || 'N/A'}
            </Text>
            <Text color="whiteAlpha.800">{viewUser?.designation || 'N/A'}</Text>
          </Box>

          <ModalBody bg={modalBg} px={6} py={4}>
            <ModalCloseButton />
            <Text
              fontSize="lg"
              fontWeight="bold"
              mb={4}
              color="blue.500"
              textAlign="center"
            >
              User Information
            </Text>
            <Box bg="gray.50" p={4} rounded="md" shadow="sm" mb={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color={labelColor}>
                    <Icon as={EmailIcon} mr={1} />
                    Email:
                  </Text>
                  <Text color={textColor}>{viewUser?.email || 'N/A'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color={labelColor}>
                    <Icon as={FaUserAlt} mr={1} />
                    Username:
                  </Text>
                  <Text color={textColor}>{viewUser?.username || 'N/A'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color={labelColor}>
                    <Icon as={FaIdBadge} mr={1} />
                    Designation:
                  </Text>
                  <Text color={textColor}>
                    {viewUser?.designation || 'N/A'}
                  </Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color={labelColor}>
                    <Icon as={PhoneIcon} mr={1} />
                    Phone Number:
                  </Text>
                  <Text color={textColor}>{viewUser?.phoneNo || 'N/A'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color={labelColor}>
                    <Icon as={FaBuilding} mr={1} />
                    Company:
                  </Text>
                  <Text color={textColor}>
                    {viewUser?.companyId?.name || 'N/A'}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>

            {viewUser?.assignedDevices?.length > 0 && (
              <>
                <Divider my={6} />
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  mb={4}
                  color="orange.500"
                  textAlign="center"
                >
                  <Icon as={MdDevices} mr={2} />
                  Assigned Devices
                </Text>
                <Box bg="gray.50" p={4} rounded="md" shadow="sm">
                  <Table variant="striped" colorScheme="blue" size="sm">
                    <Thead>
                      <Tr>
                        <Th>Device Name</Th>
                        <Th>Product ID</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {viewUser.assignedDevices.map((device) => (
                        <Tr key={device._id}>
                          <Td>{device.productName}</Td>
                          <Td>{device.productId}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default User;
