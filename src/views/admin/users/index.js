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
  });
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputTextColor = useColorModeValue('black', 'white');
  const inputPlaceholderColor = useColorModeValue('gray.500', 'gray.400');
  const getQueryString = (params) => {
    return Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== '')
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
  };

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
        (searchTerm.name || searchTerm.email || searchTerm.username)
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
      toast({
        title:
          error?.response?.data?.message ||
          error?.response?.data?.data ||
          'Error fetching companies',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchCompanies();
    getUsers();
    getAllDeviceList();
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
      { value: 'companyUser', label: 'Company User' },
    ],
    IRM: [
      { value: '', label: 'Select Role' },
      { value: 'sales', label: 'Sales' },
      { value: 'IRM', label: 'IRM' },
      { value: 'FSE', label: 'FSE' },
      { value: 'user', label: 'User' },
      { value: 'companyUser', label: 'Company User' },
    ],
    companyUser: [
      { value: '', label: 'Select Role' },
      { value: 'user', label: 'User' },
    ],
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

          <InputGroup width={{ base: '100%', sm: '100%', md: 'auto' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
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
          </InputGroup>
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

      {/* Add New User Modal */}
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInRight">
        <ModalOverlay />
        <ModalContent
          maxWidth="800px"
          mx="auto"
          style={{ height: '77vh', overflow: 'auto' }}
        >
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: '1',
              backgroundColor: modalBg,
            }}
          >
            <ModalHeader>Add New User</ModalHeader>
            <ModalCloseButton />
          </div>
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={addUser.name}
                  onChange={(e) =>
                    setAddUser({ ...addUser, name: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  value={addUser.email}
                  onChange={(e) =>
                    setAddUser({ ...addUser, email: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  name="username"
                  value={addUser.username}
                  onChange={(e) =>
                    setAddUser({ ...addUser, username: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={addUser.password}
                  onChange={(e) =>
                    setAddUser({ ...addUser, password: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  options={addRoleOptions[role]}
                  value={addRoleOptions[role].find(
                    (option) => option.value === addUser.role,
                  )}
                  onChange={(selectedOption) =>
                    setAddUser({ ...addUser, role: selectedOption.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Designation</FormLabel>
                <Input
                  name="designation"
                  value={addUser.designation}
                  onChange={(e) =>
                    setAddUser({ ...addUser, designation: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Phone No.</FormLabel>
                <Input
                  name="phoneNo"
                  value={addUser.phoneNo}
                  onChange={(e) =>
                    setAddUser({ ...addUser, phoneNo: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              {(addUser.role === 'companyUser' || addUser.role === 'user') && (
                <FormControl>
                  <FormLabel>Company</FormLabel>
                  <Select
                    options={companies.map((company) => ({
                      value: company._id,
                      label: company.name,
                    }))}
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
                  />
                </FormControl>
              )}
            </SimpleGrid>
          </ModalBody>
          <ModalFooter
            style={{
              position: 'sticky',
              bottom: 0,
              backgroundColor: modalBg,
              zIndex: '1',
            }}
          >
            <Button onClick={handleAddUser} colorScheme="blue" mr={3}>
              Add User
            </Button>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={onEditClose}
        motionPreset="slideInRight"
      >
        <ModalOverlay />
        <ModalContent
          maxWidth="800px"
          mx="auto"
          style={{ height: '80vh', overflow: 'auto' }}
        >
          <div
            style={{
              position: 'sticky',
              top: 0,
              backgroundColor: modalBg,
              zIndex: '1',
            }}
          >
            <ModalHeader>Edit User</ModalHeader>
            <ModalCloseButton />
          </div>
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={editUser?.name || ''}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  value={editUser?.email || ''}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Username</FormLabel>
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
                />
              </FormControl>

              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select
                  options={addRoleOptions[role]}
                  value={addRoleOptions[role].find(
                    (option) => option.value === editUser?.role,
                  )}
                  onChange={(selectedOption) =>
                    setEditUser({ ...editUser, role: selectedOption.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Designation</FormLabel>
                <Input
                  name="designation"
                  value={editUser?.designation || ''}
                  onChange={(e) =>
                    setEditUser({ ...editUser, designation: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Phone No.</FormLabel>
                <Input
                  name="phoneNo"
                  value={editUser?.phoneNo || ''}
                  onChange={(e) =>
                    setEditUser({ ...editUser, phoneNo: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              {(editUser?.role === 'companyUser' ||
                editUser?.role === 'user') && (
                <FormControl>
                  <FormLabel>Company</FormLabel>
                  <Select
                    options={companies.map((company) => ({
                      value: company._id,
                      label: company.name,
                    }))}
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
                  />
                </FormControl>
              )}

              <FormControl>
                <FormLabel>Password</FormLabel>
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
                />
              </FormControl>

              {(editUser?.role === 'user' ||
                editUser?.role === 'companyUser') && (
                <FormControl>
                  <FormLabel>Assigned Devices</FormLabel>
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
                  />
                </FormControl>
              )}
            </SimpleGrid>
          </ModalBody>
          <ModalFooter
            style={{
              position: 'sticky',
              bottom: 0,
              backgroundColor: modalBg,
              zIndex: '1',
            }}
          >
            <Button
              onClick={handleSave}
              colorScheme="blue"
              mr={3}
              isLoading={loading}
            >
              Save Changes
            </Button>
            <Button onClick={onEditClose} variant="ghost">
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View User Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent
          maxWidth="800px"
          mx="auto"
          style={{ maxHeight: '80vh', overflow: 'auto' }}
        >
          <ModalBody p={5}>
            <ModalCloseButton />
            <Flex alignItems="center" mb={4}>
              <Avatar size="lg" name={viewUser?.name} mr={4} />
              <Box>
                <Text fontSize="2xl" fontWeight="bold">
                  {viewUser?.name}
                </Text>
                <Text color="gray.500">{viewUser?.designation}</Text>
              </Box>
            </Flex>
            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Email
                </Text>
                <Text fontSize="md">{viewUser?.email}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Username
                </Text>
                <Text fontSize="md">{viewUser?.username}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Role
                </Text>
                <Text fontSize="md">{viewUser?.role}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Phone No.
                </Text>
                <Text fontSize="md">{viewUser?.phoneNo}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.500">
                  Company
                </Text>
                <Text fontSize="md">{viewUser?.companyId?.name || 'N/A'}</Text>
              </Box>
            </SimpleGrid>

            {viewUser?.role === 'user' || viewUser?.role === 'companyUser' ? (
              <>
                <Text fontSize="lg" fontWeight="bold" mt={6}>
                  Assigned Devices
                </Text>
                <Table variant="simple" color="gray.500" mt={2}>
                  <Thead>
                    <Tr>
                      <Th>Device Name</Th>
                      <Th>Product ID</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {viewUser?.assignedDevices?.map((device) => (
                      <Tr key={device._id}>
                        <Td>{device.productName}</Td>
                        <Td>{device.productId}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default User;
