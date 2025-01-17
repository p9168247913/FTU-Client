import React, { useState, useEffect } from 'react';
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
  SimpleGrid,
  Switch,
  HStack,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Icon,
  Text,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import axiosInstance from 'axiosInstance';
import baseUrl from 'Base_Url/baseUrl';
import Swal from 'sweetalert2';
import DevelopmentTable from './tables/DevelopmentTable';
import ReactSelect from 'react-select';
import {
  FaBarcode,
  FaBox,
  FaBuilding,
  FaCalendarAlt,
  FaCalendarCheck,
  FaCalendarTimes,
  FaCircle,
  FaClipboardCheck,
  FaClipboardList,
  FaCogs,
  FaHashtag,
  FaIndustry,
  FaNetworkWired,
  FaShieldAlt,
  FaSimCard,
  FaTag,
  FaTools,
  FaUserTie,
} from 'react-icons/fa';
const Devices = () => {
  const Token = localStorage.getItem('token');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [device, setDevice] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [productType, setProductType] = useState([]);
  const [company, setCompany] = useState([]);
  const [searchTerm, setSearchTerm] = useState({
    productName: '',
    productId: '',
    companyId: '',
  });
  const [addNewDevice, setAddNewDevice] = useState({
    productName: '',
    productId: '',
    productType: '',
    company: '',
    flowmeterSerialNumber: '',
    make: '',
    model: '',
    protocol: '',
    diameter: '',
    installedBy: '',
    commissioningDate: '',
    value: '',
    newFlowmeter: true,
    resetCounter: false,
    dashboardLicensingExpiry: '',
    flowmeterWarranty: { startDate: '', endDate: '' },
    flowmeterTelemetryWarrantyValidity: { startDate: '', endDate: '' },
    dashboardValidity: { startDate: '', endDate: '' },
    simcardValidity: { startDate: '', endDate: '' },
  });
  const [editDevice, setEditDevice] = useState({
    productName: '',
    productId: '',
    productType: '',
    company: '',
    flowmeterSerialNumber: '',
    make: '',
    model: '',
    protocol: '',
    diameter: '',
    installedBy: '',
    commissioningDate: '',
    value: '',
    newFlowmeter: true,
    resetCounter: false,
    dashboardLicensingExpiry: '',
    flowmeterWarranty: { startDate: '', endDate: '' },
    flowmeterTelemetryWarrantyValidity: { startDate: '', endDate: '' },
    dashboardValidity: { startDate: '', endDate: '' },
    simcardValidity: { startDate: '', endDate: '' },
  });
  const [editId, setEditId] = useState('');
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const inputBg = useColorModeValue('white', 'gray.700');
  const modalBg = useColorModeValue('white', 'gray.800');
  const labelColor = useColorModeValue('gray.800', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const [companies, setCompanies] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const inputTextColor = useColorModeValue('black', 'white');
  const inputPlaceholderColor = useColorModeValue('gray.500', 'gray.400');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBorderColor = useColorModeValue('gray.400', 'gray.500');
  const selectedBg = useColorModeValue('#EDF2F7', '#2D3748');
  const focusedBg = useColorModeValue('#E2E8F0', '#4A5568');
  const headerBg = useColorModeValue(
    'linear-gradient(90deg, #4299E1 0%, #3182CE 50%, #2B6CB0 100%)',
    'linear-gradient(90deg, #2C5282 0%, #2A4365 50%, #1A365D 100%)',
  );
  const addmodalheaderBg = useColorModeValue(
    'linear-gradient(90deg,rgb(34, 84, 157) 0%,rgb(60, 129, 159) 50%,rgb(93, 153, 156) 100%)',
    'linear-gradient(90deg,rgb(39, 205, 230) 0%,rgb(81, 198, 224) 50%,rgb(136, 218, 236) 100%)',
  );
  const companyOptions = [
    { value: '', label: 'Select Company' },
    ...company.map((company) => ({
      value: company._id,
      label: company.name,
    })),
  ];

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
    getAllDevices();
  }, [page, searchTerm]);

  useEffect(() => {
    productTypes();
  }, [page]);

  useEffect(() => {
    getAllCompanies();
  }, [page]);

  const getAllDevices = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `${baseUrl}/device?filter=${JSON.stringify(searchTerm)}&page=${page}`,
        { headers: { Authorization: `Bearer ${Token}` } },
      );
      const data = response.data.data;
      setDevice(data.data);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title:
          error.response.data.message ||
          error.response.data.data ||
          'Failed to load devices',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const productTypes = async () => {
    try {
      const response = await axiosInstance.get(`${baseUrl}/product`, {
        headers: { Authorization: `Bearer ${Token}` },
      });
      setProductType(response.data.data.data);
    } catch (error) {
      console.error('Error in getting product data', error);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getAllCompanies = async () => {
    try {
      const response = await axiosInstance.get(`${baseUrl}/company/list`, {
        headers: { Authorization: `Bearer ${Token}` },
      });
      setCompany(response.data.data.data);
    } catch (error) {
      console.error('Error in getting company data', error);
    }
  };

  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');

    setAddNewDevice((prevState) => {
      if (keys.length === 2) {
        return {
          ...prevState,
          [keys[0]]: {
            ...prevState[keys[0]],
            [keys[1]]: value,
          },
        };
      } else if (type === 'checkbox') {
        return {
          ...prevState,
          [name]: checked,
        };
      }
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSaveNewDevice = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${baseUrl}/device/add`,
        addNewDevice,
        {
          headers: { Authorization: `Bearer ${Token}` },
        },
      );
      onClose();
      setAddNewDevice({
        productName: '',
        productId: '',
        productType: '',
        company: '',
        flowmeterSerialNumber: '',
        make: '',
        model: '',
        protocol: '',
        diameter: '',
        installedBy: '',
        commissioningDate: '',
        value: '',
        newFlowmeter: true,
        resetCounter: false,
        dashboardLicensingExpiry: '',
        flowmeterWarranty: { startDate: '', endDate: '' },
        flowmeterTelemetryWarrantyValidity: { startDate: '', endDate: '' },
        dashboardValidity: { startDate: '', endDate: '' },
        simcardValidity: { startDate: '', endDate: '' },
      });
      toast({
        title: 'Device added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      getAllDevices();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title:
          error.response?.data?.message ||
          error.response?.data?.data ||
          'Failed to add device',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
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
            `${baseUrl}/device/delete/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${Token}`,
              },
            },
          );

          if (response.status === 200) {
            getAllDevices();
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

  const handleEdit = (device, event) => {
    event.stopPropagation();
    setEditId(device?._id);
    setEditDevice({
      productName: device?.productName || '',
      productId: device?.productId || '',
      productType: device?.productType?._id || '',
      company: device?.company?._id || '',
      flowmeterSerialNumber: device?.flowmeterSerialNumber || '',
      make: device?.make || '',
      model: device?.model || '',
      protocol: device?.protocol || '',
      diameter: device?.diameter || '',
      installedBy: device?.installedBy || '',
      commissioningDate: device?.commissioningDate || '',
      value: device?.value || 0,
      newFlowmeter: device?.newFlowmeter ?? true,
      resetCounter: device?.resetCounter || false,
      isRepairing: device?.isRepairing || false,
      dashboardLicensingExpiry: device?.dashboardLicensingExpiry || '',
      flowmeterWarranty: {
        startDate: device?.flowmeterWarranty?.startDate || '',
        endDate: device?.flowmeterWarranty?.endDate || '',
      },
      flowmeterTelemetryWarrantyValidity: {
        startDate: device?.flowmeterTelemetryWarrantyValidity?.startDate || '',
        endDate: device?.flowmeterTelemetryWarrantyValidity?.endDate || '',
      },
      dashboardValidity: {
        startDate: device?.dashboardValidity?.startDate || '',
        endDate: device?.dashboardValidity?.endDate || '',
      },
      simcardValidity: {
        startDate: device?.simcardValidity?.startDate || '',
        endDate: device?.simcardValidity?.endDate || '',
      },
    });
    onEditOpen();
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `${baseUrl}/device/update/${editId}`,
        editDevice,
        {
          headers: { Authorization: `Bearer ${Token}` },
        },
      );
      if (response) {
        setLoading(false);
        toast({
          title: 'Updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onEditClose();
        getAllDevices();
      }
    } catch (error) {
      setLoading(false);
      toast({
        title:
          error?.response?.data?.message ||
          error?.response?.data?.data ||
          'Update failed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const inputBackground = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('black', 'white');

  const selectStyles = {
    control: (base) => ({
      ...base,
      background: inputBackground,
      color: textColor,
    }),
    option: (styles) => ({
      ...styles,
      color: 'black',
    }),
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
          <InputGroup
            width={{ base: '100%', md: 'auto' }}
            mb={{ base: 2, md: 0 }}
          >
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              borderRadius={20}
              placeholder="Search by name"
              value={searchTerm.productName}
              onChange={(e) =>
                setSearchTerm((prev) => ({
                  ...prev,
                  productName: e.target.value,
                }))
              }
              leftIcon={<SearchIcon />}
              bg={useColorModeValue('white', 'gray.700')}
              color={useColorModeValue('black', 'white')}
              _placeholder={{
                color: useColorModeValue('gray.500', 'gray.400'),
              }}
            />
          </InputGroup>
          <InputGroup width={{ base: '100%', md: 'auto' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              borderRadius={20}
              placeholder="Search by product ID"
              value={searchTerm.productId}
              onChange={(e) =>
                setSearchTerm((prev) => ({
                  ...prev,
                  productId: e.target.value,
                }))
              }
              leftIcon={<SearchIcon />}
              bg={useColorModeValue('white', 'gray.700')}
              color={useColorModeValue('black', 'white')}
              _placeholder={{
                color: useColorModeValue('gray.500', 'gray.400'),
              }}
            />
          </InputGroup>
          <ReactSelect
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
          onClick={onOpen}
          colorScheme="blue"
          leftIcon={<AddIcon />}
          width={{ base: '100%', md: 'auto' }}
        >
          Add Device
        </Button>
      </Flex>

      <DevelopmentTable
        tableData={device}
        handleEditUser={(device, e) => handleEdit(device, e)}
        handleDeleteUser={(id, e) => handleDelete(id, e)}
        handlePageChange={handlePageChange}
        page={page}
        totalPages={totalPages}
        loading={loading}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent
          maxWidth="900px"
          bg={modalBg}
          roundedTop="xl"
          style={{
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Box
            bg={addmodalheaderBg}
            py={2}
            px={4}
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
              Add New Device
            </ModalHeader>
            <ModalCloseButton color="white" />
          </Box>

          <ModalBody
            overflowY="auto"
            px={6}
            py={4}
            style={{
              backgroundColor: useColorModeValue('gray.50', 'gray.800'),
            }}
          >
            <Box mb={8}>
              <Flex alignItems="center" mb={4}>
                <Icon as={FaCogs} w={6} h={6} color="blue.500" mr={2} />
                <Text fontSize="lg" fontWeight="semibold">
                  Device Details
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
                <FormControl isRequired>
                  <FormLabel fontSize="sm" color={labelColor}>
                    Product Name
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaTag} />
                    </InputLeftElement>
                    <Input
                      name="productName"
                      placeholder="Enter product name"
                      value={addNewDevice.productName}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Product ID
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaBarcode} />
                    </InputLeftElement>
                    <Input
                      name="productId"
                      placeholder="Enter product ID"
                      value={addNewDevice.productId}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Product Type
                  </FormLabel>
                  <Select
                    name="productType"
                    placeholder="Select product type"
                    value={addNewDevice.productType}
                    onChange={handleAddChange}
                    bg={useColorModeValue('white', 'gray.700')}
                    color={useColorModeValue('gray.800', 'white')}
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
                  >
                    {productType.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.type}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" color={labelColor}>
                    Company
                  </FormLabel>
                  <ReactSelect
                    name="company"
                    placeholder="Select company"
                    value={
                      company.find((comp) => comp._id === addNewDevice.company)
                        ? {
                            label: company.find(
                              (comp) => comp._id === addNewDevice.company,
                            ).name,
                            value: addNewDevice.company,
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleAddChange({
                        target: {
                          name: 'company',
                          value: selectedOption ? selectedOption.value : '',
                        },
                      })
                    }
                    options={[
                      { label: 'None', value: '' },
                      ...company.map((comp) => ({
                        label: comp.name,
                        value: comp._id,
                      })),
                    ]}
                    bg={useColorModeValue('white', 'gray.700')}
                    color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Flowmeter Serial Number
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaHashtag} />
                    </InputLeftElement>
                    <Input
                      name="flowmeterSerialNumber"
                      placeholder="Enter Flowmeter Serial Number"
                      value={addNewDevice.flowmeterSerialNumber}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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

                <FormControl
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <FormLabel fontSize="sm" color={labelColor}>
                      New Flowmeter
                    </FormLabel>
                    <Switch
                      name="newFlowmeter"
                      isChecked={addNewDevice.newFlowmeter}
                      onChange={handleAddChange}
                    />
                  </div>
                  <div>
                    <FormLabel fontSize="sm" color={labelColor}>
                      Reset Counter
                    </FormLabel>
                    <Switch
                      name="resetCounter"
                      isChecked={addNewDevice.resetCounter}
                      onChange={handleAddChange}
                    />
                  </div>
                </FormControl>
              </SimpleGrid>
            </Box>

            {/* Warranty Details Section */}
            <Box mb={8}>
              <Flex alignItems="center" mb={4}>
                <Icon as={FaShieldAlt} w={6} h={6} color="green.500" mr={2} />
                <Text fontSize="lg" fontWeight="semibold">
                  Warranty Details
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
                <FormControl>
                  <FormLabel fontSize="sm" color={labelColor}>
                    Flowmeter Warranty Start Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarAlt} />
                    </InputLeftElement>
                    <Input
                      name="flowmeterWarranty.startDate"
                      type="date"
                      value={addNewDevice.flowmeterWarranty.startDate}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Flowmeter Warranty End Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarTimes} />
                    </InputLeftElement>
                    <Input
                      name="flowmeterWarranty.endDate"
                      type="date"
                      value={addNewDevice.flowmeterWarranty.endDate}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Telemetry Warranty Start Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarAlt} />
                    </InputLeftElement>
                    <Input
                      name="flowmeterTelemetryWarrantyValidity.startDate"
                      type="date"
                      value={
                        addNewDevice.flowmeterTelemetryWarrantyValidity
                          .startDate
                      }
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Telemetry Warranty End Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarTimes} />
                    </InputLeftElement>
                    <Input
                      name="flowmeterTelemetryWarrantyValidity.endDate"
                      type="date"
                      value={
                        addNewDevice.flowmeterTelemetryWarrantyValidity.endDate
                      }
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Dashboard Validity Start Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarAlt} />
                    </InputLeftElement>
                    <Input
                      name="dashboardValidity.startDate"
                      type="date"
                      value={addNewDevice.dashboardValidity.startDate}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Dashboard Validity End Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarTimes} />
                    </InputLeftElement>
                    <Input
                      name="dashboardValidity.endDate"
                      type="date"
                      value={addNewDevice.dashboardValidity.endDate}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    SIM Card Validity Start Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaSimCard} />
                    </InputLeftElement>
                    <Input
                      name="simcardValidity.startDate"
                      type="date"
                      value={addNewDevice.simcardValidity.startDate}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    SIM Card Validity End Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaSimCard} />
                    </InputLeftElement>
                    <Input
                      name="simcardValidity.endDate"
                      type="date"
                      value={addNewDevice.simcardValidity.endDate}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Dashboard Licensing Expiry
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaClipboardCheck} />
                    </InputLeftElement>
                    <Input
                      name="dashboardLicensingExpiry"
                      type="date"
                      value={addNewDevice.dashboardLicensingExpiry}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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

            {/* Installation Details Section */}
            <Box mb={8}>
              <Flex alignItems="center" mb={4}>
                <Icon as={FaTools} w={6} h={6} color="orange.500" mr={2} />
                <Text fontSize="lg" fontWeight="semibold">
                  Installation Details
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
                <FormControl>
                  <FormLabel fontSize="sm" color={labelColor}>
                    Installed By
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaUserTie} />
                    </InputLeftElement>
                    <Input
                      name="installedBy"
                      placeholder="Enter installer"
                      value={addNewDevice.installedBy}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Commissioning Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarCheck} />
                    </InputLeftElement>
                    <Input
                      name="commissioningDate"
                      type="date"
                      value={addNewDevice.commissioningDate}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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

            {/* Additional Details Section */}
            <Box mb={8}>
              <Flex alignItems="center" mb={4}>
                <Icon
                  as={FaClipboardList}
                  w={6}
                  h={6}
                  color="purple.500"
                  mr={2}
                />
                <Text fontSize="lg" fontWeight="semibold">
                  Additional Details
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
                {/* Value */}
                <FormControl>
                  <FormLabel fontSize="sm" color={labelColor}>
                    Value
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaTag} />
                    </InputLeftElement>
                    <Input
                      name="value"
                      type="number"
                      placeholder="Enter value"
                      value={addNewDevice.value}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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

                {/* Diameter */}
                <FormControl>
                  <FormLabel fontSize="sm" color={labelColor}>
                    Diameter
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCircle} />
                    </InputLeftElement>
                    <Input
                      name="diameter"
                      placeholder="Enter diameter"
                      value={addNewDevice.diameter}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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

                {/* Make */}
                <FormControl>
                  <FormLabel fontSize="sm" color={labelColor}>
                    Make
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaIndustry} />
                    </InputLeftElement>
                    <Input
                      name="make"
                      placeholder="Enter make"
                      value={addNewDevice.make}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Model
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCogs} />
                    </InputLeftElement>
                    <Input
                      name="model"
                      placeholder="Enter model"
                      value={addNewDevice.model}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Protocol
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaNetworkWired} />
                    </InputLeftElement>
                    <Input
                      name="protocol"
                      placeholder="Enter protocol"
                      value={addNewDevice.protocol}
                      onChange={handleAddChange}
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
              variant="ghost"
              colorScheme="red"
              fontWeight="medium"
              onClick={onClose}
              borderRadius="md"
              _hover={{ bg: useColorModeValue('red.50', 'red.900') }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSaveNewDevice}
              isLoading={loading}
              borderRadius="md"
              shadow="sm"
              _hover={{ shadow: 'md', transform: 'translateY(-1px)' }}
            >
              Add Device
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose} size="md">
        <ModalOverlay />
        <ModalContent
          maxWidth="900px"
          bg={modalBg}
          roundedTop="xl"
          style={{
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Box
            bg={addmodalheaderBg}
            py={2}
            px={4}
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
              Edit Device
            </ModalHeader>
            <ModalCloseButton />
          </Box>
          <ModalBody
            overflowY="auto"
            px={6}
            py={4}
            style={{
              backgroundColor: useColorModeValue('gray.50', 'gray.800'),
            }}
          >
            <Box mb={8}>
              <Flex alignItems="center" mb={4}>
                <Icon as={FaCogs} w={6} h={6} color="blue.500" mr={2} />
                <Text fontSize="lg" fontWeight="semibold">
                  Device Details
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
                <FormControl isRequired>
                  <FormLabel fontSize="sm" color={labelColor}>
                    Product Name
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaTag} />
                    </InputLeftElement>
                    <Input
                      name="productName"
                      value={editDevice.productName}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          productName: e.target.value,
                        })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Product ID
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaBarcode} />
                    </InputLeftElement>
                    <Input
                      name="productId"
                      value={editDevice.productId}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          productId: e.target.value,
                        })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Product Type
                  </FormLabel>
                  <Select
                    name="productType"
                    placeholder="Select product type"
                    value={editDevice.productType}
                    onChange={(e) =>
                      setEditDevice({
                        ...editDevice,
                        productType: e.target.value,
                      })
                    }
                    bg={useColorModeValue('white', 'gray.700')}
                    color={useColorModeValue('gray.800', 'white')}
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
                  >
                    {productType.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.type}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" color={labelColor}>
                    Company
                  </FormLabel>
                  <ReactSelect
                    name="company"
                    placeholder="Select company"
                    value={
                      company.find((comp) => comp._id === editDevice.company)
                        ? {
                            label: company.find(
                              (comp) => comp._id === editDevice.company,
                            ).name,
                            value: editDevice.company,
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      setEditDevice((prev) => ({
                        ...prev,
                        company: selectedOption ? selectedOption.value : '',
                      }))
                    }
                    options={[
                      { label: 'None', value: '' },
                      ...company.map((comp) => ({
                        label: comp.name,
                        value: comp._id,
                      })),
                    ]}
                    styles={selectStyles}
                    bg={useColorModeValue('white', 'gray.700')}
                    color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Flowmeter Serial Number
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaHashtag} />
                    </InputLeftElement>
                    <Input
                      name="flowmeterSerialNumber"
                      value={editDevice.flowmeterSerialNumber}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          flowmeterSerialNumber: e.target.value,
                        })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('black', 'white')}
                      _placeholder={{
                        color: useColorModeValue('gray.500', 'gray.400'),
                      }}
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
                    />
                  </InputGroup>
                </FormControl>

                <FormControl
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: '124px',
                    }}
                  >
                    <FormLabel fontSize={'sm'} color={labelColor}>
                      New Flowmeter
                    </FormLabel>
                    <Switch
                      name="newFlowmeter"
                      isChecked={editDevice.newFlowmeter}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          newFlowmeter: e.target.checked,
                        })
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: '114px',
                    }}
                  >
                    <FormLabel fontSize={'sm'} color={labelColor}>
                      Reset Counter
                    </FormLabel>
                    <Switch
                      name="resetCounter"
                      isChecked={editDevice.resetCounter}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          resetCounter: e.target.checked,
                        })
                      }
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: '114px',
                    }}
                  >
                    <FormLabel fontSize={'sm'} color={labelColor}>
                      {editDevice.isRepairing
                        ? 'Repair Enabled'
                        : 'Not in Repair'}
                    </FormLabel>
                    <Switch
                      name="resetCounter"
                      isChecked={editDevice.isRepairing}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          isRepairing: e.target.checked,
                        })
                      }
                    />
                  </div>
                </FormControl>
              </SimpleGrid>
            </Box>

            <Box mb={8}>
              <Flex alignItems="center" mb={4}>
                <Icon as={FaShieldAlt} w={6} h={6} color="green.500" mr={2} />
                <Text fontSize="lg" fontWeight="semibold">
                  Warranty Details
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
                <FormControl>
                  <FormLabel fontSize="sm" color={labelColor}>
                    Flowmeter Warranty Start Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarAlt} />
                    </InputLeftElement>
                    <Input
                      name="flowmeterWarranty.startDate"
                      type="date"
                      value={
                        editDevice?.flowmeterWarranty?.startDate
                          ? new Date(editDevice?.flowmeterWarranty?.startDate)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setEditDevice((prev) => ({
                          ...prev,
                          flowmeterWarranty: {
                            ...prev.flowmeterWarranty,
                            startDate: e.target.value,
                          },
                        }))
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Flowmeter Warranty End Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarTimes} />
                    </InputLeftElement>
                    <Input
                      name="flowmeterWarranty.endDate"
                      type="date"
                      value={
                        editDevice?.flowmeterWarranty?.endDate
                          ? new Date(editDevice?.flowmeterWarranty?.endDate)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setEditDevice((prev) => ({
                          ...prev,
                          flowmeterWarranty: {
                            ...prev.flowmeterWarranty,
                            endDate: e.target.value,
                          },
                        }))
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Telemetry Warranty Start Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarAlt} />
                    </InputLeftElement>
                    <Input
                      name="flowmeterTelemetryWarrantyValidity.startDate"
                      type="date"
                      value={
                        editDevice?.flowmeterTelemetryWarrantyValidity
                          ?.startDate
                          ? new Date(
                              editDevice?.flowmeterTelemetryWarrantyValidity?.startDate,
                            )
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setEditDevice((prev) => ({
                          ...prev,
                          flowmeterTelemetryWarrantyValidity: {
                            ...prev.flowmeterTelemetryWarrantyValidity,
                            startDate: e.target.value,
                          },
                        }))
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                {/* ---- */}
                <FormControl>
                  <FormLabel fontSize="sm" color={labelColor}>
                    Telemetry Warranty End Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarTimes} />
                    </InputLeftElement>
                    <Input
                      name="flowmeterTelemetryWarrantyValidity.endDate"
                      type="date"
                      value={
                        editDevice?.flowmeterTelemetryWarrantyValidity?.endDate
                          ? new Date(
                              editDevice?.flowmeterTelemetryWarrantyValidity?.endDate,
                            )
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setEditDevice((prev) => ({
                          ...prev,
                          flowmeterTelemetryWarrantyValidity: {
                            ...prev.flowmeterTelemetryWarrantyValidity,
                            endDate: e.target.value,
                          },
                        }))
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Dashboard Validity Start Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarAlt} />
                    </InputLeftElement>
                    <Input
                      name="dashboardValidity.startDate"
                      type="date"
                      value={
                        editDevice?.dashboardValidity?.startDate
                          ? new Date(editDevice?.dashboardValidity?.startDate)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setEditDevice((prev) => ({
                          ...prev,
                          dashboardValidity: {
                            ...prev.dashboardValidity,
                            startDate: e.target.value,
                          },
                        }))
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Dashboard Validity End Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarTimes} />
                    </InputLeftElement>
                    <Input
                      name="dashboardValidity.endDate"
                      type="date"
                      value={
                        editDevice?.dashboardValidity?.endDate
                          ? new Date(editDevice?.dashboardValidity?.endDate)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setEditDevice((prev) => ({
                          ...prev,
                          dashboardValidity: {
                            ...prev.dashboardValidity,
                            endDate: e.target.value,
                          },
                        }))
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    SIM Card Validity Start Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaSimCard} />
                    </InputLeftElement>
                    <Input
                      name="simcardValidity.startDate"
                      type="date"
                      value={
                        editDevice?.simcardValidity?.startDate
                          ? new Date(editDevice?.simcardValidity?.startDate)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setEditDevice((prev) => ({
                          ...prev,
                          simcardValidity: {
                            ...prev.simcardValidity,
                            startDate: e.target.value,
                          },
                        }))
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    SIM Card Validity End Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaSimCard} />
                    </InputLeftElement>
                    <Input
                      name="simcardValidity.endDate"
                      type="date"
                      value={
                        editDevice?.simcardValidity?.endDate
                          ? new Date(editDevice?.simcardValidity?.endDate)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setEditDevice((prev) => ({
                          ...prev,
                          simcardValidity: {
                            ...prev.simcardValidity,
                            endDate: e.target.value,
                          },
                        }))
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Dashboard Licensing Expiry
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaClipboardCheck} />
                    </InputLeftElement>
                    <Input
                      name="dashboardLicensingExpiry"
                      type="date"
                      value={
                        editDevice.dashboardLicensingExpiry
                          ? new Date(editDevice.dashboardLicensingExpiry)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          dashboardLicensingExpiry: e.target.value,
                        })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                <Icon as={FaTools} w={6} h={6} color="orange.500" mr={2} />
                <Text fontSize="lg" fontWeight="semibold">
                  Installation Details
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
                <FormControl>
                  <FormLabel fontSize="sm" color={labelColor}>
                    Installed By
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaUserTie} />
                    </InputLeftElement>
                    <Input
                      name="installedBy"
                      value={editDevice.installedBy}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          installedBy: e.target.value,
                        })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Commissioning Date
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCalendarCheck} />
                    </InputLeftElement>
                    <Input
                      name="commissioningDate"
                      type="date"
                      value={
                        editDevice.commissioningDate
                          ? new Date(editDevice.commissioningDate)
                              .toISOString()
                              .split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          commissioningDate: e.target.value,
                        })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                <Icon
                  as={FaClipboardList}
                  w={6}
                  h={6}
                  color="purple.500"
                  mr={2}
                />
                <Text fontSize="lg" fontWeight="semibold">
                  Additional Details
                </Text>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
                <FormControl>
                  <FormLabel fontSize="sm" color={labelColor}>
                    Value
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaTag} />
                    </InputLeftElement>
                    <Input
                      name="value"
                      type="number"
                      value={editDevice.value}
                      onChange={(e) =>
                        setEditDevice({ ...editDevice, value: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Diameter
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCircle} />
                    </InputLeftElement>
                    <Input
                      name="diameter"
                      value={editDevice.diameter}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          diameter: e.target.value,
                        })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Make
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaIndustry} />
                    </InputLeftElement>
                    <Input
                      name="make"
                      value={editDevice.make}
                      onChange={(e) =>
                        setEditDevice({ ...editDevice, make: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Model
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaCogs} />
                    </InputLeftElement>
                    <Input
                      name="model"
                      value={editDevice.model}
                      onChange={(e) =>
                        setEditDevice({ ...editDevice, model: e.target.value })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
                  <FormLabel fontSize="sm" color={labelColor}>
                    Protocol
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none" color="gray.400">
                      <Icon as={FaNetworkWired} />
                    </InputLeftElement>
                    <Input
                      name="protocol"
                      value={editDevice.protocol}
                      onChange={(e) =>
                        setEditDevice({
                          ...editDevice,
                          protocol: e.target.value,
                        })
                      }
                      bg={useColorModeValue('white', 'gray.700')}
                      color={useColorModeValue('gray.800', 'white')}
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
              variant="ghost"
              colorScheme="red"
              fontWeight="medium"
              borderRadius="md"
              _hover={{ bg: useColorModeValue('red.50', 'red.900') }}
              onClick={onEditClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              borderRadius="md"
              shadow="sm"
              _hover={{ shadow: 'md', transform: 'translateY(-1px)' }}
              onClick={handleSave}
              isLoading={loading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Devices;
