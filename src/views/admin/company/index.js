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
  InputRightElement,
  Card,
  Tooltip,
  Icon,
  Divider,
} from '@chakra-ui/react';
import {
  AddIcon,
  CopyIcon,
  EditIcon,
  DeleteIcon,
  SearchIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import axiosInstance from 'axiosInstance';
import baseUrl from 'Base_Url/baseUrl';
import DevelopmentTable from './tables/DevelopmentTable';
import Swal from 'sweetalert2';
import { useColorModeValue } from '@chakra-ui/react';
import { FiMapPin } from 'react-icons/fi';
import {
  InfoOutlineIcon,
  EmailIcon,
  PhoneIcon,
  AtSignIcon,
  CloseIcon,
  CheckCircleIcon,
  ArrowUpIcon,
} from '@chakra-ui/icons';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { MdDevices, MdStreetview } from 'react-icons/md';
import { FaFlag, FaGlobe, FaHome } from 'react-icons/fa';
import { useBreakpointValue } from '@chakra-ui/react';

import { MdLocationCity, MdConfirmationNumber } from 'react-icons/md';

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
    // companyId: '',
    email1: '',
    email2: '',
    contact1: '',
    contact2: '',
    allowedLimit: null,
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
    allowedLimit: null,
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

  const modalBg = useColorModeValue('white', 'gray.800');
  const labelColor = useColorModeValue('gray.800', 'gray.300');
  const columnsCount = useBreakpointValue({ base: 1, sm: 2, md: 2, lg: 3 });
  const headerBg = useColorModeValue(
    'linear-gradient(90deg, #38A169 0%, #48BB78 50%, #68D391 100%)',
    'linear-gradient(90deg, #38A169 0%, #48BB78 50%, #68D391 100%)',
  );
  const sectionBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const handleRowClick = (company) => {
    setSelectedCompany(company);
    onViewOpen();
  };
  useEffect(() => {
    getCompany();
  }, [page, searchTerm, rowsPerPage]);

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
    setEditId(company?._id);
    setEditCompany({
      ...editCompany,
      name: company?.name,
      companyId: company.companyId,
      email1: company?.email1,
      email2: company?.email2,
      contact1: company?.contact1,
      contact2: company?.contact2,
      allowedLimit: company?.allowedLimit,
      companyRepresentativeName: company?.companyRepresentativeName,
      aquasenseSalesRepresentative: company?.aquasenseSalesRepresentative?._id,
      aquasenseIRMUser: company?.aquasenseIRMUser?._id,
      addressId: company?.address?._id,
      addressLine: company?.address?.addressLine,
      city: company?.address?.city,
      state: company?.address?.state,
      country: company?.address?.country,
      zipcode: company?.address?.zipcode,
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
    // if (
    //   !addCompany.name ||
    //   !addCompany.email1 ||
    //   !addCompany.email2 ||
    //   !addCompany.contact1 ||
    //   !addCompany.contact2 ||
    //   !addCompany.addressLine ||
    //   !addCompany.city ||
    //   !addCompany.state ||
    //   !addCompany.country ||
    //   !addCompany.zipcode ||
    //   !addCompany.companyRepresentativeName ||
    //   !addCompany.aquasenseSalesRepresentative ||
    //   !addCompany.aquasenseIRMUser
    // ) {
    //   toast({
    //     title: 'Please fill all required fields!',
    //     status: 'info',
    //     duration: 3000,
    //     isClosable: true,
    //   });
    //   return;
    // }

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
          width={{ base: '100%', md: 'auto' }}
        >
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
              borderRadius={20}
            />
          </InputGroup>
        </HStack>
        <Button
          colorScheme="blue"
          onClick={onOpen}
          leftIcon={<AddIcon />}
          width={{ base: '100%', md: 'auto' }}
        >
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
        <ModalContent
          maxWidth="800px"
          mx="auto"
          bg={modalBg}
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
            <ModalHeader>Add Company</ModalHeader>
            <ModalCloseButton />
          </div>
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
              <FormControl mb="4" isRequired>
                <FormLabel fontSize={'sm'}>Company Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Enter company name"
                  value={addCompany?.name}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4" isRequired>
                <FormLabel fontSize={'sm'}>Primary Email</FormLabel>
                <Input
                  name="email1"
                  type="email"
                  placeholder="Enter primary email address"
                  value={addCompany?.email1}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel fontSize={'sm'}>Secondary Email</FormLabel>
                <Input
                  name="email2"
                  type="email"
                  placeholder="Enter secondary email address"
                  value={addCompany?.email2}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4" isRequired>
                <FormLabel fontSize={'sm'}>Primary Contact</FormLabel>
                <Input
                  name="contact1"
                  placeholder="Enter primary contact"
                  value={addCompany?.contact1}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel fontSize={'sm'}>Secondary Contact</FormLabel>
                <Input
                  name="contact2"
                  placeholder="Enter secondary contact"
                  value={addCompany?.contact2}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4" isRequired>
                <FormLabel fontSize={'sm'}>Allowed Limit</FormLabel>
                <InputGroup>
                  <Input
                    name="allowedLimit"
                    placeholder="Enter allowed limit"
                    value={addCompany?.allowedLimit}
                    onChange={handleAddChange}
                    bg={useColorModeValue('white', 'gray.700')}
                    color={useColorModeValue('black', 'white')}
                    _placeholder={{
                      color: useColorModeValue('gray.500', 'gray.400'),
                    }}
                  />
                  <InputRightElement>
                    <Text
                      color={useColorModeValue('gray.500', 'gray.400')}
                      fontSize="sm"
                    >
                      m³
                    </Text>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl mb="4">
                <FormLabel fontSize={'sm'}>Address Line</FormLabel>
                <Input
                  name="addressLine"
                  placeholder="Enter address"
                  value={addCompany?.addressLine}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel fontSize={'sm'}>City</FormLabel>
                <Input
                  name="city"
                  placeholder="Enter city"
                  value={addCompany?.city}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel fontSize={'sm'}>State</FormLabel>
                <Input
                  name="state"
                  placeholder="Enter state"
                  value={addCompany?.state}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel fontSize={'sm'}>Country</FormLabel>
                <Input
                  name="country"
                  placeholder="Enter country"
                  value={addCompany?.country}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel fontSize={'sm'}>Zipcode</FormLabel>
                <Input
                  name="zipcode"
                  placeholder="Enter zipcode"
                  value={addCompany?.zipcode}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel fontSize={'sm'}>Company Contact Person</FormLabel>
                <Input
                  name="companyRepresentativeName"
                  placeholder="Enter contact person name"
                  value={addCompany?.companyRepresentativeName}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl mb="4">
                <FormLabel fontSize={'sm'}>Aquasense Sales Executive</FormLabel>
                <Select
                  name="aquasenseSalesRepresentative"
                  placeholder="Select Sales Executive"
                  value={addCompany?.aquasenseSalesRepresentative}
                  onChange={handleAddChange}
                >
                  {users
                    ?.filter((user) => user?.role === 'sales')
                    .map((filteredUser) => (
                      <option key={filteredUser?._id} value={filteredUser?._id}>
                        {filteredUser?.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl mb="4">
                <FormLabel fontSize={'sm'}>Aquasense IRM Executive</FormLabel>
                <Select
                  name="aquasenseIRMUser"
                  placeholder="Select IRM Executive"
                  value={addCompany?.aquasenseIRMUser}
                  onChange={handleAddChange}
                >
                  {users
                    ?.filter((user) => user?.role === 'IRM')
                    .map((filteredUser) => (
                      <option key={filteredUser?._id} value={filteredUser?._id}>
                        {filteredUser?.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
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
        <ModalContent
          maxWidth="800px"
          mx="auto"
          bg={modalBg}
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
            <ModalHeader>Edit Company</ModalHeader>
            <ModalCloseButton />
          </div>
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
              <FormControl>
                <FormLabel fontSize={'sm'}>Company Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Enter company name"
                  value={editCompany?.name}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>Primary Email</FormLabel>
                <Input
                  name="email1"
                  type="email"
                  placeholder="Enter primary email address"
                  value={editCompany?.email1}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>Secondary Email</FormLabel>
                <Input
                  name="email2"
                  type="email"
                  placeholder="Enter secondary email address"
                  value={editCompany?.email2}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>Primary Contact</FormLabel>
                <Input
                  name="contact1"
                  placeholder="Enter primary contact"
                  value={editCompany?.contact1}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>Secondary Contact</FormLabel>
                <Input
                  name="contact2"
                  placeholder="Enter secondary contact"
                  value={editCompany?.contact2}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>Allowed Limit</FormLabel>
                <InputGroup>
                  <Input
                    name="allowedLimit"
                    placeholder="Enter allowed limit"
                    value={editCompany?.allowedLimit}
                    onChange={handleEditChange}
                    bg={useColorModeValue('white', 'gray.700')}
                    color={useColorModeValue('black', 'white')}
                    _placeholder={{
                      color: useColorModeValue('gray.500', 'gray.400'),
                    }}
                  />
                  <InputRightElement>
                    <Text
                      color={useColorModeValue('gray.500', 'gray.400')}
                      fontSize="sm"
                    >
                      m³
                    </Text>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>Address Line</FormLabel>
                <Input
                  name="addressLine"
                  placeholder="Enter address"
                  value={editCompany?.addressLine}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>City</FormLabel>
                <Input
                  name="city"
                  placeholder="Enter city"
                  value={editCompany?.city}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>State</FormLabel>
                <Input
                  name="state"
                  placeholder="Enter state"
                  value={editCompany?.state}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>Country</FormLabel>
                <Input
                  name="country"
                  placeholder="Enter country"
                  value={editCompany?.country}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>Zipcode</FormLabel>
                <Input
                  name="zipcode"
                  placeholder="Enter zipcode"
                  value={editCompany?.zipcode}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>Company Contact Person</FormLabel>
                <Input
                  name="companyRepresentativeName"
                  placeholder="Enter contact person name"
                  value={editCompany?.companyRepresentativeName}
                  onChange={handleEditChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>Aquasense Sales Executive</FormLabel>
                <Select
                  name="aquasenseSalesRepresentative"
                  placeholder="Select Sales Executive"
                  value={editCompany?.aquasenseSalesRepresentative}
                  onChange={handleEditChange}
                >
                  {users
                    ?.filter((user) => user?.role === 'sales')
                    .map((filteredUser) => (
                      <option key={filteredUser?._id} value={filteredUser?._id}>
                        {filteredUser?.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize={'sm'}>Aquasense IRM Executive</FormLabel>
                <Select
                  name="aquasenseIRMUser"
                  placeholder="Select IRM Executive"
                  value={editCompany?.aquasenseIRMUser}
                  onChange={handleEditChange}
                >
                  {users
                    ?.filter((user) => user?.role === 'IRM')
                    .map((filteredUser) => (
                      <option key={filteredUser?._id} value={filteredUser?._id}>
                        {filteredUser?.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
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
        <ModalContent maxWidth="800px" mx="auto" rounded="lg" shadow="lg">
          <Box
            bg={headerBg}
            color="white"
            py={1}
            textAlign="center"
            roundedTop="lg"
          >
            <ModalHeader fontSize="2xl" fontWeight="bold">
              <Icon as={InfoOutlineIcon} mr={2} />
              COMPANY DETAILS
            </ModalHeader>
            <ModalCloseButton />
          </Box>

          <ModalBody>
            {selectedCompany && (
              <Box p={4}>
                <Box mb={6}>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    mb={4}
                    color="purple.500"
                  >
                    <Icon as={InfoIcon} mr={2} />
                    Basic Information
                  </Text>
                  <Box bg={sectionBg} p={4} rounded="md" shadow="md">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color={labelColor}
                        >
                          <Icon as={AtSignIcon} mr={1} />
                          Company Name:
                        </Text>
                        <Text color={textColor}>
                          {selectedCompany?.name || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color={labelColor}
                        >
                          <Icon as={EmailIcon} mr={1} />
                          Primary Email:
                        </Text>
                        <Text color={textColor}>
                          {selectedCompany?.email1 || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color={labelColor}
                        >
                          <Icon as={EmailIcon} mr={1} />
                          Secondary Email:
                        </Text>
                        <Text color={textColor}>
                          {selectedCompany?.email2 || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color={labelColor}
                        >
                          <Icon as={PhoneIcon} mr={1} />
                          Primary Contact:
                        </Text>
                        <Text color={textColor}>
                          {selectedCompany?.contact1 || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color={labelColor}
                        >
                          <Icon as={PhoneIcon} mr={1} />
                          Secondary Contact:
                        </Text>
                        <Text color={textColor}>
                          {selectedCompany?.contact2 || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color={labelColor}
                        >
                          <Icon as={CheckCircleIcon} mr={1} />
                          Representative Name:
                        </Text>
                        <Text color={textColor}>
                          {selectedCompany?.companyRepresentativeName || 'N/A'}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </Box>
                <Divider my={6} />
                <Box mb={6}>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    mb={4}
                    color="green.500"
                  >
                    <Icon as={FaMapMarkerAlt} mr={2} />
                    Address Information
                  </Text>
                  <Box bg={sectionBg} p={4} rounded="md" shadow="md">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color={labelColor}
                        >
                          <Icon as={FaHome} mr={1} />
                          Address Line:
                        </Text>
                        <Text color={textColor}>
                          {selectedCompany?.address?.addressLine || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color={labelColor}
                        >
                          <Icon as={MdStreetview} mr={1} />
                          City:
                        </Text>
                        <Text color={textColor}>
                          {selectedCompany?.address?.city || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color={labelColor}
                        >
                          <Icon as={FaFlag} mr={1} />
                          State:
                        </Text>
                        <Text color={textColor}>
                          {selectedCompany?.address?.state || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color={labelColor}
                        >
                          <Icon as={FaGlobe} mr={1} />
                          Country:
                        </Text>
                        <Text color={textColor}>
                          {selectedCompany?.address?.country || 'N/A'}
                        </Text>
                      </Box>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="sm"
                          color={labelColor}
                        >
                          <Icon as={MdConfirmationNumber} mr={1} />
                          Zipcode:
                        </Text>
                        <Text color={textColor}>
                          {selectedCompany?.address?.zipcode || 'N/A'}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </Box>

                {selectedCompany?.devices?.length > 0 && (
                  <>
                    <Divider my={6} />
                    <Box>
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        mb={4}
                        color="orange.500"
                      >
                        <Icon as={MdDevices} mr={2} />
                        Assigned Devices
                      </Text>
                      <Table
                        variant="striped"
                        colorScheme="blue"
                        size="sm"
                        bg={sectionBg}
                        shadow="md"
                      >
                        <Thead>
                          <Tr>
                            <Th>Device Name</Th>
                            <Th>Product ID</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {selectedCompany.devices.map((device) => (
                            <Tr key={device._id}>
                              <Td>{device?.productName}</Td>
                              <Td>{device?.productId}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </ModalBody>

          {/* Footer */}
          <Box
            bg={headerBg}
            py={3}
            px={6}
            textAlign="center"
            roundedBottom="lg"
            shadow="md"
          >
            <Button
              onClick={onViewClose}
              colorScheme="whiteAlpha"
              size="md"
              leftIcon={<CloseIcon />}
            >
              Close
            </Button>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Company;
