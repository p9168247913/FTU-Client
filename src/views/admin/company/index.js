import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useDisclosure,
  useToast,
  Spinner,
  Text,
  InputGroup,
  InputLeftElement,
  HStack,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import {
  AddIcon,
  CopyIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
} from '@chakra-ui/icons';
import axiosInstance from 'axiosInstance';
import baseUrl from 'Base_Url/baseUrl';
import DevelopmentTable from './tables/DevelopmentTable';
import Swal from 'sweetalert2';
import { useColorModeValue } from '@chakra-ui/react';

const Company = () => {
  const Token = localStorage.getItem('token');
  const toast = useToast();
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

  const [company, setCompany] = useState([]);
  const [editCompany, setEditCompany] = useState({
    name: '',
    companyId: '',
    email1: '',
    email2: '',
    contact1: '',
    contact2: '',
    companyRepresentativeName: '',
    aquasenseSalesRepresentative: '',
    aquasenseIRMUser: '',
    addressId: '',
    addressLine: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
  });
  const [addCompany, setAddCompany] = useState({
    name: '',
    email1: '',
    email2: '',
    contact1: '',
    contact2: '',
    companyRepresentativeName: '',
    aquasenseSalesRepresentative: '',
    aquasenseIRMUser: '',
    addressLine: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
  });
  const [searchTerm, setSearchTerm] = useState({ name: '' });
  const [page, setPage] = useState(1);
  const [totalResult, setTotalResult] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [editId, setEditId] = useState('');
  const [users, setUsers] = useState([]);
  // Open view modal with company data
  const handleRowClick = (company) => {
    setSelectedCompany(company);
    onViewOpen();
  };
  useEffect(() => {
    getCompany();
  }, [page, searchTerm]);

  const getQueryString = (params) => {
    return Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== '')
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
  };

  const getCompany = async () => {
    try {
      const queryParams = {
        page: page ? page : 1,
        limit: rowsPerPage,
      };
      let filter = {};

      if (searchTerm && searchTerm?.name) {
        filter = {
          ...filter,
          ...searchTerm,
        };
      }
      if (Object.keys(filter).length > 0) {
        queryParams.filter = JSON.stringify(filter);
      }
      const response = await axiosInstance.get(
        `${baseUrl}/company?${getQueryString(queryParams)}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      if (response) {
        console.log('-----', response);

        setCompany(response?.data?.data?.data);
        setPage(response?.data?.data?.page);
        setTotalResult(response?.data?.data?.totalResults);
        setTotalPages(response?.data?.data?.totalPages);
        setLoading(false);
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

  const handleEdit = (company, event) => {
    setEditId(company._id);
    setEditCompany({
      ...editCompany,
      name: company.name,
      companyId: company.companyId,
      email1: company.email1,
      email2: company.email2,
      contact1: company.contact1,
      contact2: company.contact2,
      companyRepresentativeName: company.companyRepresentativeName,
      aquasenseSalesRepresentative: company.aquasenseSalesRepresentative._id,
      aquasenseIRMUser: company.aquasenseIRMUser._id,
      addressId: company.address._id,
      addressLine: company.address.addressLine,
      city: company.address.city,
      state: company.address.state,
      country: company.address.country,
      zipcode: company.address.zipcode,
    });
    onEditOpen();
  };

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
            `${baseUrl}/company/delete/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${Token}`,
              },
            },
          );

          if (response.status === 200) {
            getCompany();
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

  const handleSave = async () => {
    if (
      !editCompany.name ||
      !editCompany.email1 ||
      !editCompany.email2 ||
      !editCompany.contact1 ||
      !editCompany.contact2 ||
      !editCompany.addressLine ||
      !editCompany.city ||
      !editCompany.state ||
      !editCompany.country ||
      !editCompany.zipcode ||
      !editCompany.companyRepresentativeName ||
      !editCompany.aquasenseSalesRepresentative ||
      !editCompany.aquasenseIRMUser
    ) {
      toast({
        title: 'Please fill all fields!',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `${baseUrl}/company/update/${editId}`,
        editCompany,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      if (response) {
        setLoading(false);
        onEditClose();
        toast({
          title: 'Updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        getCompany();
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

  const handleAddCompany = async () => {
    if (
      !addCompany.name ||
      !addCompany.email1 ||
      !addCompany.email2 ||
      !addCompany.contact1 ||
      !addCompany.contact2 ||
      !addCompany.addressLine ||
      !addCompany.city ||
      !addCompany.state ||
      !addCompany.country ||
      !addCompany.zipcode ||
      !addCompany.companyRepresentativeName ||
      !addCompany.aquasenseSalesRepresentative ||
      !addCompany.aquasenseIRMUser
    ) {
      toast({
        title: 'Please fill all fields!',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `${baseUrl}/company/add`,
        addCompany,
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
          title: 'Company added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        getCompany();
        setAddCompany({
          name: '',
          email1: '',
          email2: '',
          contact1: '',
          contact2: '',
          companyRepresentativeName: '',
          aquasenseSalesRepresentative: '',
          aquasenseIRMUser: '',
          addressLine: '',
          city: '',
          state: '',
          country: '',
          zipcode: '',
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCompany({ ...editCompany, [name]: value });
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddCompany({ ...addCompany, [name]: value });
  };

  useEffect(() => {
    getCompany();
    getUsers();
  }, [page, rowsPerPage, searchTerm]);

  const handlePageChange = (page) => {
    setCompany([]);
    setPage(page);
    setLoading(true);
  };

  const getUsers = async () => {
    try {
      const queryParams = {
        page: page ? page : 1,
        limit: rowsPerPage,
      };

      const response = await axiosInstance.get(
        `${baseUrl}/auth/users?${getQueryString(queryParams)}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      if (response) {
        setUsers(response?.data?.data?.data);
        setLoading(false);
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

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex
        mb="5"
        justifyContent={{ base: 'center', md: 'space-between' }}
        alignItems="center"
        flexDirection={{ base: 'column', md: 'row' }}
        gap={{ base: 4, md: 0 }}
      >
        <HStack spacing={3} mb={{ base: 3, md: 0 }} width={{ base: '100%', md: 'auto' }}>
          <InputGroup width={{ base: '100%', md: 'auto' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search by name"
              value={searchTerm.name}
              onChange={(e) =>
                setSearchTerm({
                  ...searchTerm,
                  name: e.target.value ? e.target.value : '',
                })
              }
              width="auto"
              bg={useColorModeValue('white', 'gray.700')}
              color={useColorModeValue('black', 'white')}
              _placeholder={{
                color: useColorModeValue('gray.500', 'gray.400'),
              }}
            />
          </InputGroup>
        </HStack>
        <Button colorScheme="blue" onClick={onOpen} leftIcon={<AddIcon />} width={{ base: '100%', md: 'auto' }}>
          Add Company
        </Button>
      </Flex>
      <DevelopmentTable
        tableData={company}
        handleEditUser={(device, e) => handleEdit(device, e)}
        handleDeleteUser={(id) => handleDelete(id)}
        handlePageChange={handlePageChange}
        handleRowClick={handleRowClick}
        page={page}
        totalPages={totalPages}
        loading={loading}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent maxWidth="800px" mx="auto">
          <ModalHeader>Add Company</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
              <FormControl mb="4">
                <FormLabel>Company Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Enter company name"
                  value={addCompany.name}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Primary Email</FormLabel>
                <Input
                  name="email1"
                  type="email"
                  placeholder="Enter primary email address"
                  value={addCompany.email1}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Secondary Email</FormLabel>
                <Input
                  name="email2"
                  type="email"
                  placeholder="Enter secondary email address"
                  value={addCompany.email2}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Primary Contact</FormLabel>
                <Input
                  name="contact1"
                  placeholder="Enter primary contact"
                  value={addCompany.contact1}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Secondary Contact</FormLabel>
                <Input
                  name="contact2"
                  placeholder="Enter secondary contact"
                  value={addCompany.contact2}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Address Line</FormLabel>
                <Input
                  name="addressLine"
                  placeholder="Enter address"
                  value={addCompany.addressLine}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>City</FormLabel>
                <Input
                  name="city"
                  placeholder="Enter city"
                  value={addCompany.city}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>State</FormLabel>
                <Input
                  name="state"
                  placeholder="Enter state"
                  value={addCompany.state}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Country</FormLabel>
                <Input
                  name="country"
                  placeholder="Enter country"
                  value={addCompany.country}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Zipcode</FormLabel>
                <Input
                  name="zipcode"
                  placeholder="Enter zipcode"
                  value={addCompany.zipcode}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Company Contact Person</FormLabel>
                <Input
                  name="companyRepresentativeName"
                  placeholder="Enter contact person name"
                  value={addCompany.companyRepresentativeName}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Aquasense Sales Executive</FormLabel>
                <Select
                  name="aquasenseSalesRepresentative"
                  placeholder="Select Sales Executive"
                  value={addCompany.aquasenseSalesRepresentative}
                  onChange={handleAddChange}
                >
                  {users
                    ?.filter((user) => user.role === 'sales')
                    .map((filteredUser) => (
                      <option key={filteredUser._id} value={filteredUser._id}>
                        {filteredUser.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl mb="4">
                <FormLabel>Aquasense IRM Executive</FormLabel>
                <Select
                  name="aquasenseIRMUser"
                  placeholder="Select IRM Executive"
                  value={addCompany.aquasenseIRMUser}
                  onChange={handleAddChange}
                >
                  {users
                    ?.filter((user) => user.role === 'IRM')
                    .map((filteredUser) => (
                      <option key={filteredUser._id} value={filteredUser._id}>
                        {filteredUser.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddCompany}
              isLoading={loading}
              ml={3}
            >
              Add Company
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalOverlay />
        <ModalContent maxWidth="800px" mx="auto">
          <ModalHeader>Edit Company</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
              <FormControl>
                <FormLabel>Company Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Enter company name"
                  value={editCompany.name}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Primary Email</FormLabel>
                <Input
                  name="email1"
                  type="email"
                  placeholder="Enter primary email address"
                  value={editCompany.email1}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Secondary Email</FormLabel>
                <Input
                  name="email2"
                  type="email"
                  placeholder="Enter secondary email address"
                  value={editCompany.email2}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Primary Contact</FormLabel>
                <Input
                  name="contact1"
                  placeholder="Enter primary contact"
                  value={editCompany.contact1}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Secondary Contact</FormLabel>
                <Input
                  name="contact2"
                  placeholder="Enter secondary contact"
                  value={editCompany.contact2}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Address Line</FormLabel>
                <Input
                  name="addressLine"
                  placeholder="Enter address"
                  value={editCompany.addressLine}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>City</FormLabel>
                <Input
                  name="city"
                  placeholder="Enter city"
                  value={editCompany.city}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>State</FormLabel>
                <Input
                  name="state"
                  placeholder="Enter state"
                  value={editCompany.state}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Country</FormLabel>
                <Input
                  name="country"
                  placeholder="Enter country"
                  value={editCompany.country}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Zipcode</FormLabel>
                <Input
                  name="zipcode"
                  placeholder="Enter zipcode"
                  value={editCompany.zipcode}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Company Contact Person</FormLabel>
                <Input
                  name="companyRepresentativeName"
                  placeholder="Enter contact person name"
                  value={editCompany.companyRepresentativeName}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Aquasense Sales Executive</FormLabel>
                <Select
                  name="aquasenseSalesRepresentative"
                  placeholder="Select Sales Executive"
                  value={editCompany.aquasenseSalesRepresentative}
                  onChange={handleEditChange}
                >
                  {users
                    ?.filter((user) => user.role === 'sales')
                    .map((filteredUser) => (
                      <option key={filteredUser._id} value={filteredUser._id}>
                        {filteredUser.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Aquasense IRM Executive</FormLabel>
                <Select
                  name="aquasenseIRMUser"
                  placeholder="Select IRM Executive"
                  value={editCompany.aquasenseIRMUser}
                  onChange={handleEditChange}
                >
                  {users
                    ?.filter((user) => user.role === 'IRM')
                    .map((filteredUser) => (
                      <option key={filteredUser._id} value={filteredUser._id}>
                        {filteredUser.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onEditClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSave}
              isLoading={loading}
              ml={3}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent maxWidth="800px" mx="auto">
          <ModalHeader fontSize="2xl" fontWeight="bold" textAlign="center">
            Company Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedCompany && (
              <Box p="4">
                {/* Basic Information Section */}
                <Text fontSize="lg" fontWeight="bold" mt="4" mb="2">
                  Basic Information
                </Text>
                <SimpleGrid columns={2} spacing={4} mb="4">
                  <Box>
                    <Text fontWeight="bold">Company Name:</Text>
                    <Text>{selectedCompany.name}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Company ID:</Text>
                    <Text>{selectedCompany.companyId}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Primary Email:</Text>
                    <Text>{selectedCompany.email1}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Secondary Email:</Text>
                    <Text>{selectedCompany.email2}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Primary Contact:</Text>
                    <Text>{selectedCompany.contact1}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Secondary Contact:</Text>
                    <Text>{selectedCompany.contact2}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Representative:</Text>
                    <Text>{selectedCompany.companyRepresentativeName}</Text>
                  </Box>
                </SimpleGrid>

                {/* Address Section */}
                <Text fontSize="lg" fontWeight="bold" mt="4" mb="2">
                  Address
                </Text>
                <SimpleGrid columns={2} spacing={4} mb="4">
                  <Box>
                    <Text fontWeight="bold">Address Line:</Text>
                    <Text>{selectedCompany.address.addressLine}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">City:</Text>
                    <Text>{selectedCompany.address.city}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">State:</Text>
                    <Text>{selectedCompany.address.state}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Country:</Text>
                    <Text>{selectedCompany.address.country}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Zipcode:</Text>
                    <Text>{selectedCompany.address.zipcode}</Text>
                  </Box>
                </SimpleGrid>

                {/* Assigned Devices Section */}
                <Text fontSize="lg" fontWeight="bold" mt="4" mb="2">
                  Assigned Devices
                </Text>
                <Table variant="simple" size="sm" mb="4">
                  <Thead>
                    <Tr>
                      <Th fontSize="sm" fontWeight="bold">
                        Device Name
                      </Th>
                      <Th fontSize="sm" fontWeight="bold">
                        Product ID
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {selectedCompany.devices.map((device) => (
                      <Tr key={device._id}>
                        <Td>{device.productName}</Td>
                        <Td>{device.productId}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onViewClose} variant="ghost">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Company;
