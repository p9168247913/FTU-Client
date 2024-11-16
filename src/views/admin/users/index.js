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
  Select,
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
  const [viewUser, setViewUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      console.error('Error fetching companies', error);
    }
  };

  useEffect(() => {
    fetchCompanies();
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
    setEditUser(user);
    onEditOpen();
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: editUser.name,
        email: editUser.email,
        username: editUser.username,
        role: editUser.role,
        designation: editUser.designation,
        phoneNo: editUser.phoneNo,
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
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.message || 'Error updating user',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleAddUser = async () => {
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
      setLoading(true);
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
  
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex justifyContent="space-between" mb={5} wrap="wrap">
        <HStack spacing={3} mb={{ base: 3, md: 0 }}>
          <InputGroup>
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

          <InputGroup>
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

          <InputGroup>
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
        <Button colorScheme="blue" leftIcon={<AddIcon />} onClick={onOpen}>
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
        <ModalContent maxWidth="800px" mx="auto">
          <ModalHeader>Add New User</ModalHeader>
          <ModalCloseButton />
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
                  name="role"
                  value={addUser.role}
                  onChange={(e) =>
                    setAddUser({ ...addUser, role: e.target.value })
                  }
                >
                  {role === 'admin' && (
                    <>
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="sales">Sales</option>
                      <option value="IRM">IRM</option>
                      <option value="FSE">FSE</option>
                      <option value="user">User</option>
                      <option value="companyUser">Company User</option>
                    </>
                  )}

                  {role === 'IRM' && (
                    <>
                      <option value="">Select Role</option>
                      <option value="sales">Sales</option>
                      <option value="IRM">IRM</option>
                      <option value="FSE">FSE</option>
                      <option value="user">User</option>
                      <option value="companyUser">Company User</option>
                    </>
                  )}

                  {role === 'companyUser' && (
                    <>
                      <option value="">Select Role</option>
                      <option value="user">User</option>
                    </>
                  )}
                </Select>
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
                    name="companyId"
                    value={addUser.companyId}
                    onChange={(e) =>
                      setAddUser({ ...addUser, companyId: e.target.value })
                    }
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              )}
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
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
        <ModalContent maxWidth="800px" mx="auto">
          <ModalHeader>Edit User</ModalHeader>
          <ModalCloseButton />
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
                  name="role"
                  value={editUser?.role || ''}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                >
                  {role === 'admin' && (
                    <>
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="sales">Sales</option>
                      <option value="IRM">IRM</option>
                      <option value="FSE">FSE</option>
                      <option value="user">User</option>
                      <option value="companyUser">Company User</option>
                    </>
                  )}

                  {role === 'IRM' && (
                    <>
                      <option value="">Select Role</option>
                      <option value="sales">Sales</option>
                      <option value="IRM">IRM</option>
                      <option value="FSE">FSE</option>
                      <option value="user">User</option>
                      <option value="companyUser">Company User</option>
                    </>
                  )}

                  {role === 'companyUser' && (
                    <>
                      <option value="">Select Role</option>
                      <option value="user">User</option>
                    </>
                  )}
                </Select>
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
                    name="companyId"
                    title="Select Company"
                    value={editUser?.companyId?._id || ''}
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        companyId: {
                          _id: e.target.value,
                          name: companies.find((c) => c._id === e.target.value)
                            ?.name,
                        },
                      })
                    }
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </Select>
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
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSave} colorScheme="blue" mr={3}>
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
        <ModalContent maxWidth="800px" mx="auto">
          <ModalHeader>User Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box borderWidth="1px" borderRadius="lg" p={5} boxShadow="lg">
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
                  <Text fontSize="md">
                    {viewUser?.companyId?.name || 'N/A'}
                  </Text>
                </Box>
              </SimpleGrid>

              {/* Assigned Devices Table */}
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
            </Box>
          </ModalBody>
          {/* <ModalFooter>
            <Button onClick={onViewClose} colorScheme="blue" variant="outline">
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default User;
