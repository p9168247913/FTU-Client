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
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import axiosInstance from 'axiosInstance';
import baseUrl from 'Base_Url/baseUrl';
import Swal from 'sweetalert2';
import DevelopmentTable from './tables/DevelopmentTable';

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
    productType: '',
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

  useEffect(() => {
    getAllDevices();
    productTypes();
    getAllCompanies();
  }, [page, searchTerm]);

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
        title: error.response.data.message || 'Failed to load devices',
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
      const response = await axiosInstance.get(`${baseUrl}/company`, {
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
    } catch (error) {
      toast({
        title: error.response?.data?.message || 'Failed to add device',
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
      productType: device?.productType._id || '',
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

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex mb="5" justifyContent="space-between" alignItems="center">
        <HStack spacing={3} mb={{ base: 3, md: 0 }}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
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

          {/* <Select
            placeholder="Filter by Product Type"
            value={searchTerm.productType}
            onChange={(e) =>
              setSearchTerm((prev) => ({
                ...prev,
                productType: e.target.value,
              }))
            }
          >
            {productType.map((type) => (
              <option key={type._id} value={type._id}>
                {type.type}
              </option>
            ))}
          </Select> */}
        </HStack>
        <Button onClick={onOpen} colorScheme="blue" leftIcon={<AddIcon />}>
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

      {/* Add Device Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent
          maxWidth="800px"
          mx="auto"
          bg={modalBg} // Dark mode background color
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
            <ModalHeader>Add Device</ModalHeader>
            <ModalCloseButton />
          </div>
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
              <FormControl isRequired>
                <FormLabel color={labelColor}>Product Name</FormLabel>
                <Input
                  name="productName"
                  placeholder="Enter product name"
                  value={addNewDevice.productName}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={labelColor}>Product ID</FormLabel>
                <Input
                  name="productId"
                  placeholder="Enter product ID"
                  value={addNewDevice.productId}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={labelColor}>Product Type</FormLabel>
                <Select
                  name="productType"
                  placeholder="Select product type"
                  value={addNewDevice.productType}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
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
                <FormLabel color={labelColor}>Company</FormLabel>
                <Select
                  name="company"
                  placeholder="Select company"
                  value={addNewDevice.company}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                >
                  {company.map((comp) => (
                    <option key={comp._id} value={comp._id}>
                      {comp.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>
                  Flowmeter Serial Number
                </FormLabel>
                <Input
                  name="flowmeterSerialNumber"
                  placeholder="Enter Flowmeter Serial Number"
                  value={addNewDevice.flowmeterSerialNumber}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>
                  Dashboard Licensing Expiry
                </FormLabel>
                <Input
                  name="dashboardLicensingExpiry"
                  type="date"
                  value={addNewDevice.dashboardLicensingExpiry}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Make</FormLabel>
                <Input
                  name="make"
                  placeholder="Enter make"
                  value={addNewDevice.make}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Model</FormLabel>
                <Input
                  name="model"
                  placeholder="Enter model"
                  value={addNewDevice.model}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Protocol</FormLabel>
                <Input
                  name="protocol"
                  placeholder="Enter protocol"
                  value={addNewDevice.protocol}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Diameter</FormLabel>
                <Input
                  name="diameter"
                  placeholder="Enter diameter"
                  value={addNewDevice.diameter}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Installed By</FormLabel>
                <Input
                  name="installedBy"
                  placeholder="Enter installer"
                  value={addNewDevice.installedBy}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Commissioning Date</FormLabel>
                <Input
                  name="commissioningDate"
                  type="date"
                  value={addNewDevice.commissioningDate}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Value</FormLabel>
                <Input
                  name="value"
                  type="number"
                  value={addNewDevice.value}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <FormLabel color={labelColor}>New Flowmeter</FormLabel>
                  <Switch
                    name="newFlowmeter"
                    isChecked={addNewDevice.newFlowmeter}
                    onChange={handleAddChange}
                  />
                </div>
                <div>
                  <FormLabel color={labelColor}>Reset Counter</FormLabel>
                  <Switch
                    name="resetCounter"
                    isChecked={addNewDevice.resetCounter}
                    onChange={handleAddChange}
                  />
                </div>
              </FormControl>

              {/* Warranty and Validity Dates */}
              <FormControl>
                <FormLabel color={labelColor}>
                  Flowmeter Warranty Start Date
                </FormLabel>
                <Input
                  name="flowmeterWarranty.startDate"
                  type="date"
                  value={addNewDevice.flowmeterWarranty.startDate}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={labelColor}>
                  Flowmeter Warranty End Date
                </FormLabel>
                <Input
                  name="flowmeterWarranty.endDate"
                  type="date"
                  value={addNewDevice.flowmeterWarranty.endDate}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={labelColor}>
                  Telemetry Warranty Start Date
                </FormLabel>
                <Input
                  name="flowmeterTelemetryWarrantyValidity.startDate"
                  type="date"
                  value={
                    addNewDevice.flowmeterTelemetryWarrantyValidity.startDate
                  }
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={labelColor}>
                  Telemetry Warranty End Date
                </FormLabel>
                <Input
                  name="flowmeterTelemetryWarrantyValidity.endDate"
                  type="date"
                  value={
                    addNewDevice.flowmeterTelemetryWarrantyValidity.endDate
                  }
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={labelColor}>
                  Dashboard Validity Start Date
                </FormLabel>
                <Input
                  name="dashboardValidity.startDate"
                  type="date"
                  value={addNewDevice.dashboardValidity.startDate}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={labelColor}>
                  Dashboard Validity End Date
                </FormLabel>
                <Input
                  name="dashboardValidity.endDate"
                  type="date"
                  value={addNewDevice.dashboardValidity.endDate}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={labelColor}>
                  SIM Card Validity Start Date
                </FormLabel>
                <Input
                  name="simcardValidity.startDate"
                  type="date"
                  value={addNewDevice.simcardValidity.startDate}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>
              <FormControl>
                <FormLabel color={labelColor}>
                  SIM Card Validity End Date
                </FormLabel>
                <Input
                  name="simcardValidity.endDate"
                  type="date"
                  value={addNewDevice.simcardValidity.endDate}
                  onChange={handleAddChange}
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
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
              onClick={handleSaveNewDevice}
              isLoading={loading}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onClose={onEditClose} size="md">
        <ModalOverlay />
        <ModalContent
          maxWidth="800px"
          mx="auto"
          bg={modalBg} // Dark mode background color
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
            <ModalHeader>Edit Device</ModalHeader>
            <ModalCloseButton />
          </div>
          <ModalBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4">
              <FormControl isRequired>
                <FormLabel color={labelColor}>Product Name</FormLabel>
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
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={labelColor}>Product ID</FormLabel>
                <Input
                  name="productId"
                  value={editDevice.productId}
                  onChange={(e) =>
                    setEditDevice({ ...editDevice, productId: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={labelColor}>Product Type</FormLabel>
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
                  color={useColorModeValue('black', 'white')}
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
                <FormLabel color={labelColor}>Company</FormLabel>
                <Select
                  name="company"
                  placeholder="Select company"
                  value={editDevice.company}
                  onChange={(e) =>
                    setEditDevice({ ...editDevice, company: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                >
                  {company.map((comp) => (
                    <option key={comp._id} value={comp._id}>
                      {comp.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>
                  Flowmeter Serial Number
                </FormLabel>
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
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>
                  Dashboard Licensing Expiry
                </FormLabel>
                <Input
                  name="dashboardLicensingExpiry"
                  type="date"
                  value={editDevice.dashboardLicensingExpiry}
                  onChange={(e) =>
                    setEditDevice({
                      ...editDevice,
                      dashboardLicensingExpiry: e.target.value,
                    })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Make</FormLabel>
                <Input
                  name="make"
                  value={editDevice.make}
                  onChange={(e) =>
                    setEditDevice({ ...editDevice, make: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Model</FormLabel>
                <Input
                  name="model"
                  value={editDevice.model}
                  onChange={(e) =>
                    setEditDevice({ ...editDevice, model: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Protocol</FormLabel>
                <Input
                  name="protocol"
                  value={editDevice.protocol}
                  onChange={(e) =>
                    setEditDevice({ ...editDevice, protocol: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Diameter</FormLabel>
                <Input
                  name="diameter"
                  value={editDevice.diameter}
                  onChange={(e) =>
                    setEditDevice({ ...editDevice, diameter: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Installed By</FormLabel>
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
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Commissioning Date</FormLabel>
                <Input
                  name="commissioningDate"
                  type="date"
                  value={editDevice.commissioningDate}
                  onChange={(e) =>
                    setEditDevice({
                      ...editDevice,
                      commissioningDate: e.target.value,
                    })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>Value</FormLabel>
                <Input
                  name="value"
                  type="number"
                  value={editDevice.value}
                  onChange={(e) =>
                    setEditDevice({ ...editDevice, value: e.target.value })
                  }
                  bg={useColorModeValue('white', 'gray.700')}
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <FormLabel color={labelColor}>New Flowmeter</FormLabel>
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
                <div>
                  <FormLabel color={labelColor}>Reset Counter</FormLabel>
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
              </FormControl>

              {/* <FormControl>
                
              </FormControl> */}

              {/* Warranty and Validity Date Inputs */}
              <FormControl>
                <FormLabel color={labelColor}>
                  Flowmeter Warranty Start Date
                </FormLabel>
                <Input
                  name="flowmeterWarranty.startDate"
                  type="date"
                  value={editDevice.flowmeterWarranty?.startDate || ''}
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
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>
                  Flowmeter Warranty End Date
                </FormLabel>
                <Input
                  name="flowmeterWarranty.endDate"
                  type="date"
                  value={editDevice.flowmeterWarranty?.endDate || ''}
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
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>
                  Telemetry Warranty Start Date
                </FormLabel>
                <Input
                  name="flowmeterTelemetryWarrantyValidity.startDate"
                  type="date"
                  value={
                    editDevice.flowmeterTelemetryWarrantyValidity?.startDate ||
                    ''
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
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>
                  Telemetry Warranty End Date
                </FormLabel>
                <Input
                  name="flowmeterTelemetryWarrantyValidity.endDate"
                  type="date"
                  value={
                    editDevice.flowmeterTelemetryWarrantyValidity?.endDate || ''
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
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>
                  Dashboard Validity Start Date
                </FormLabel>
                <Input
                  name="dashboardValidity.startDate"
                  type="date"
                  value={editDevice.dashboardValidity?.startDate || ''}
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
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>
                  Dashboard Validity End Date
                </FormLabel>
                <Input
                  name="dashboardValidity.endDate"
                  type="date"
                  value={editDevice.dashboardValidity?.endDate || ''}
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
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>
                  SIM Card Validity Start Date
                </FormLabel>
                <Input
                  name="simcardValidity.startDate"
                  type="date"
                  value={editDevice.simcardValidity?.startDate || ''}
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
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel color={labelColor}>
                  SIM Card Validity End Date
                </FormLabel>
                <Input
                  name="simcardValidity.endDate"
                  type="date"
                  value={editDevice.simcardValidity?.endDate || ''}
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
                  color={useColorModeValue('black', 'white')}
                  _placeholder={{
                    color: useColorModeValue('gray.500', 'gray.400'),
                  }}
                />
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
            <Button colorScheme="blue" onClick={handleSave} isLoading={loading}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Devices;