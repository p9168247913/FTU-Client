import {
  Box,
  Flex,
  Text,
  // Select,
  SimpleGrid,
  useColorModeValue,
  VStack,
  Stack,
  Progress,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListItem,
  Select as ChakraSelect,
  Button,
  IconButton,
  Card,
  useColorMode,
  useToast,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Spinner } from '@chakra-ui/react';
import { CircularProgress } from '@chakra-ui/react';
import { Skeleton, SkeletonText, SkeletonCircle } from '@chakra-ui/react';
import './index.css';
import Select from 'react-select';
import LiquidGauge from 'react-liquid-gauge';
import { useEffect, useState } from 'react';
import { format, set } from 'date-fns';
import { SearchIcon } from '@chakra-ui/icons';
import baseUrl from 'Base_Url/baseUrl';
import axiosInstance from 'axiosInstance';
import { MdPinDrop } from 'react-icons/md';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import ReactSpeedometer from 'react-d3-speedometer';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const toast = useToast();
  const [productId, setProductId] = useState([]);
  const [selectedPID, setSelectedPID] = useState('');
  const [pidData, setPidData] = useState([]);
  const [companyData, setCompanyData] = useState([]);
  const [unit, setUnit] = useState('m³');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedCompany2, setSelectedCompany2] = useState({
    label: '',
    value: '',
  });
  const Token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [page, setPage] = useState(1);
  const [totalResult, setTotalResult] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [loading, setLoading] = useState(false);
  const { colorMode } = useColorMode();
  const [totalConsumption, setTotalConsumption] = useState(0);

  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  const sectionBg = useColorModeValue('gray.100', 'gray.800');

  const selectBg = useColorModeValue('white', 'gray.700');
  const selectTextColor = useColorModeValue('black', 'white');
  const fieldColor = useColorModeValue('gray.600', 'gray.400');
  const valueColor = useColorModeValue('gray.500', 'gray.300');
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const companyOptions = [
    { value: '', label: 'Select Company' },
    ...companyData.map((company) => ({
      value: company._id,
      label: company.name,
    })),
  ];
  const productIdOptions = [{ value: '', label: 'All' }, ...productId];
  const unitOptions = [
    { value: 'm³', label: 'm³' },
    { value: 'Liters', label: 'Liters' },
    { value: 'Gallons', label: 'Gallons' },
  ];

  const withinLimitColor = useColorModeValue('green.400', 'green.300');
  const exceededLimitColor = useColorModeValue('red.400', 'red.300');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const progressBg = useColorModeValue('gray.200', 'gray.700');

  const selectedCompanyData = companyData.find(
    (company) => company._id === selectedCompany,
  );

  const inputBg = useColorModeValue('white', 'gray.700');
  const inputTextColor = useColorModeValue('black', 'white');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBorderColor = useColorModeValue('gray.400', 'gray.500');
  const selectedBg = useColorModeValue('#EDF2F7', '#2D3748');
  const focusedBg = useColorModeValue('#E2E8F0', '#4A5568');

  const selectBorderColor = useColorModeValue('gray.300', 'gray.600');
  const selectHoverBorderColor = useColorModeValue('gray.400', 'gray.500');
  const selectMenuBg = useColorModeValue('white', 'gray.800');
  const selectOptionHoverBg = useColorModeValue('gray.100', 'gray.700');

  const progressPercentage = selectedCompanyData
    ? (selectedCompanyData?.consumption / selectedCompanyData?.limit) * 100
    : 0;
  const progressColor = selectedCompanyData
    ? selectedCompanyData?.consumption <= selectedCompanyData?.limit
      ? withinLimitColor
      : exceededLimitColor
    : withinLimitColor;

  const filteredPidData = selectedPID
    ? pidData?.filter((pid) => pid?.productId === selectedPID)
    : pidData;

  const convertReading = (reading) => {
    if (unit === 'Liters') {
      return reading * 1000;
    } else if (unit === 'Gallons') {
      return reading * 264.172;
    }
    return reading;
  };

  const convertFlowrate = (flowrate) => {
    if (unit === 'Liters') {
      return {
        value: flowrate * 1000,
        unit: 'L/hr',
      };
    } else if (unit === 'Gallons') {
      return {
        value: flowrate * 264.172,
        unit: 'gal/hr',
      };
    }
    return {
      value: flowrate,
      unit: 'm³/hr',
    };
  };

  const formatDate = (timestamp) => {
    return format(new Date(timestamp), 'do MMM, yyyy hh:mm a');
  };

  const getAllProductId = async () => {
    try {
      const queryParams = {};
      let filter = {};

      if (selectedCompany) {
        filter = {
          ...filter,
          companyId: selectedCompany,
        };
      }
      if (Object.keys(filter).length > 0) {
        queryParams.filter = JSON.stringify(filter);
      }
      const response = await axiosInstance.get(
        `${baseUrl}/device-readings/unique?${getQueryString(queryParams)}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      if (response) {
        const formattedProductIds = response?.data?.data?.data.map((pid) => ({
          value: pid,
          label: pid,
        }));
        setProductId(formattedProductIds || []);
      }
    } catch (error) {
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

  const getQueryString = (params) => {
    return Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== '')
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
  };

  const getDeviceData = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page: page ? page : 1,
        limit: rowsPerPage,
      };
      let filter = {};

      if (selectedCompany) {
        filter = {
          ...filter,
          companyId: selectedCompany,
        };
      }

      if (selectedPID) {
        filter = {
          ...filter,
          productId: selectedPID,
        };
      }
      if (Object.keys(filter).length > 0) {
        queryParams.filter = JSON.stringify(filter);
      }
      const response = await axiosInstance.get(
        `${baseUrl}/device-readings/latest?${getQueryString(queryParams)}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      if (response) {
        setPidData(response?.data?.data?.data);
        setPage(response?.data?.data?.page);
        setTotalPages(response?.data?.data?.totalPages);
        setTotalResult(response?.data?.data?.totalResults);
      }
    } catch (error) {
      toast({
        title: error?.response?.data?.data
          ? error?.response?.data?.data
          : error?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
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
      // toast({
      //   title: error?.response?.data?.data
      //     ? error?.response?.data?.data
      //     : error?.response?.data?.message,
      //   status: 'error',
      //   duration: 3000,
      //   isClosable: true,
      // });
    }
  };

  useEffect(() => {
    getAllProductId();
  }, [selectedCompany]);

  useEffect(() => {
    getDeviceData();
  }, [selectedPID, selectedCompany, page, rowsPerPage]);

  useEffect(() => {
    getCompanyList();
  }, []);

  const handleSelectChange = (selectedOption) => {
    setPage(1);
    setSelectedPID(selectedOption.value);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const renderPagination = () => {
    const maxPagesToShow = 5;
    const pages = [];
    const isEllipsisShown = totalPages > maxPagesToShow;

    const createPageButton = (pageNumber) => (
      <Button
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
        colorScheme={page === pageNumber ? 'blue' : 'gray'}
        variant={page === pageNumber ? 'solid' : 'outline'}
        mx="1"
      >
        {pageNumber}
      </Button>
    );

    if (isEllipsisShown) {
      if (page > Math.ceil(maxPagesToShow / 2)) {
        pages.push(createPageButton(1));
        pages.push(
          <Text key="ellipsis-start" mx="1" fontSize="lg">
            ...
          </Text>,
        );
      }

      const startPage = Math.max(page - Math.floor(maxPagesToShow / 2), 1);
      const endPage = Math.min(
        page + Math.floor(maxPagesToShow / 2),
        totalPages,
      );
      for (let i = startPage; i <= endPage; i++) {
        pages.push(createPageButton(i));
      }

      if (page < totalPages - Math.floor(maxPagesToShow / 2)) {
        pages.push(
          <Text key="ellipsis-end" mx="1" fontSize="lg">
            ...
          </Text>,
        );
        pages.push(createPageButton(totalPages));
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(createPageButton(i));
      }
    }

    return (
      <Flex mt="4" justify="center" align="center">
        <IconButton
          aria-label="Previous Page"
          icon={<ChevronLeftIcon />}
          isDisabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          mr="2"
        />
        {pages}
        <IconButton
          aria-label="Next Page"
          icon={<ChevronRightIcon />}
          isDisabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
          ml="2"
        />
      </Flex>
    );
  };

  const getTotalConsumption = async (companyId) => {
    try {
      const queryParams = {};
      let filter = {};

      filter = {
        ...filter,
        companyId: companyId,
      };

      if (Object.keys(filter).length > 0) {
        queryParams.filter = JSON.stringify(filter);
      }
      const response = await axiosInstance.get(
        `${baseUrl}/device-readings/total-consumption?${getQueryString(
          queryParams,
        )}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      if (response) {
        setTotalConsumption(response?.data?.data?.totalConsumption || 0);
      }
    } catch (error) {
      setTotalConsumption(0);
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

  const speedometerAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const handleCompanyChange = (selectedOption) => {
    setPage(1);
    setSelectedCompany2(selectedOption);
    setSelectedCompany(selectedOption.value);
    setSelectedPID('');
    getTotalConsumption(selectedOption.value);
  };

  useEffect(() => {
    if (selectedCompany) {
      getTotalConsumption(selectedCompany);
    }
  }, [selectedCompany]);

  return (
    <Box
      pt={{ base: '140px', md: '90px', xl: '90px', sm: '100px' }}
      px={{ base: '4', md: '8' }}
    >
      {role === 'companyUser' || role === 'user' ? (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
            delay: 0.2,
          }}
        >
          <Card p={{ base: 2, md: 4 }} mb={4}>
            <Text
              fontSize={{ base: 'lg', md: '2xl' }}
              fontWeight="bold"
              mb={{ base: 2, md: 4 }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              {selectedCompany2?.label}
            </Text>
            <Box mb={2}>
              <Flex
                gap={{ base: 1, md: 2 }}
                mb={1}
                flexDirection={{ base: 'column', md: 'row' }}
                alignItems={{ base: 'center', md: 'flex-start' }}
              >
                <Text fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold">
                  Total Consumption:
                </Text>
                <Text
                  mt={{ base: 0, md: 0.5 }}
                  fontSize={{ base: 'sm', md: 'md' }}
                  color={textColor}
                >
                  {convertReading(totalConsumption).toFixed(2) +
                    ' / ' +
                    convertReading(
                      selectedCompanyData?.allowedLimit || 0,
                    ).toFixed(2)}{' '}
                  {unit}
                </Text>
              </Flex>
              <Progress
                value={
                  (totalConsumption /
                    (selectedCompanyData?.allowedLimit || 1)) *
                  100
                }
                colorScheme={
                  totalConsumption <= (selectedCompanyData?.allowedLimit || 0)
                    ? 'green'
                    : 'red'
                }
                bg={progressBg}
                hasStripe
                isAnimated
                rounded="md"
                height={{ base: '8px', md: '12px' }}
                w={{ base: '80%', md: '20%' }}
                mx={{ base: 'auto', md: 0 }}
              />
              <Text fontSize="sm" color={withinLimitColor} mt={2}>
                {(
                  (totalConsumption /
                    (selectedCompanyData?.allowedLimit || 1)) *
                  100
                ).toFixed(1)}
                % of limit
              </Text>
            </Box>
          </Card>
        </motion.div>
      ) : (
        <Box w="100%" maxWidth="600px" mx="auto" mb={4}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
              delay: 0.2,
            }}
          >
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
                  width: '100%',
                  bgColor: 'gray.100',
                }),
                control: (base) => ({
                  ...base,
                  backgroundColor: inputBg,
                  color: inputTextColor,
                  borderColor: borderColor,
                  borderRadius:'20px',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: hoverBorderColor,
                  },
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
          </motion.div>
        </Box>
      )}

      {role !== 'companyUser' && role !== 'user' && selectedCompany && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
            delay: 1,
          }}
        >
          <Box mb={{ base: 4, md: 8 }}>
            <Flex
              gap={{ base: 1, md: 2 }}
              mb={1}
              flexDirection={{ base: 'column', md: 'row' }}
              alignItems={{ base: 'center', md: 'flex-start' }}
            >
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="bold"
                textAlign={{ base: 'center', md: 'left' }}
              >
                Total Consumption:
              </Text>
              <Text
                fontSize={{ base: 'sm', md: 'md' }}
                color={textColor}
                textAlign={{ base: 'center', md: 'left' }}
              >
                {convertReading(totalConsumption).toFixed(2) +
                  ' / ' +
                  convertReading(
                    selectedCompanyData?.allowedLimit || 0,
                  ).toFixed(2)}{' '}
                {unit}
              </Text>
            </Flex>
            <Progress
              value={
                (totalConsumption / (selectedCompanyData?.allowedLimit || 1)) *
                100
              }
              colorScheme={
                totalConsumption <= (selectedCompanyData?.allowedLimit || 0)
                  ? 'green'
                  : 'red'
              }
              bg={progressBg}
              hasStripe
              isAnimated
              rounded="md"
              height={{ base: '8px', md: '12px' }}
              w={{ base: '80%', md: '20%' }}
              mx={{ base: 'auto', md: 0 }}
            />
            <Text
              fontSize={{ base: 'xs', md: 'sm' }}
              color={progressColor}
              mt={{ base: 1, md: 2 }}
              textAlign={{ base: 'center', md: 'left' }}
            >
              {(
                (totalConsumption / (selectedCompanyData?.allowedLimit || 1)) *
                100
              ).toFixed(1)}
              % of allowed limit
            </Text>
          </Box>
        </motion.div>
      )}

      <Flex
        alignItems={{ base: 'flex-start', md: 'center' }}
        flexDirection={{ base: 'column', md: 'row' }}
        width="full"
        justifyContent={{ base: 'center', md: 'space-between' }}
        gap={{ base: 4, md: 0 }}
        mb={4}
      >
        <motion.div
          style={{ width: '300px' }}
          initial={{ opacity: 0, x: -50 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Select
            options={productIdOptions}
            value={productIdOptions?.find(
              (option) => option.value === selectedPID,
            )}
            onChange={handleSelectChange}
            placeholder="Select Product ID"
            isSearchable={true}
            styles={{
              container: (base) => ({
                ...base,
                width: '100%',
                maxWidth: '300px',
              }),
              control: (base) => ({
                ...base,
                backgroundColor: selectBg, 
                color: selectTextColor,
                borderColor: selectBorderColor,
                borderRadius:'20px',
                ':hover': {
                  borderColor: selectHoverBorderColor,
                },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: selectBg,
                zIndex: 10,
              }),
              menuList: (base) => ({
                ...base,
                backgroundColor: selectBg,
                maxHeight: '200px',
                overflowY: 'auto',
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                  ? selectOptionHoverBg
                  : selectBg, // Highlight focused option
                color: selectTextColor,
                ':active': {
                  backgroundColor: selectOptionHoverBg,
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: selectTextColor,
              }),
            }}
          />
        </motion.div>

        <motion.div
          style={{ width: '150px' }}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Select
            options={unitOptions}
            value={unitOptions.find((option) => option.value === unit)}
            onChange={(selectedOption) => setUnit(selectedOption.value)}
            placeholder="Select Unit"
            isSearchable={false}
            styles={{
              container: (base) => ({
                ...base,
                width: '100%',
                maxWidth: '150px',
              }),
              control: (base) => ({
                ...base,
                backgroundColor: selectBg,
                color: selectTextColor,
                borderColor: selectBorderColor,
                borderRadius:'20px',
                ':hover': {
                  borderColor: selectHoverBorderColor,
                },
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: selectMenuBg,
                color: selectTextColor,
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused
                  ? selectOptionHoverBg
                  : selectMenuBg,
                color: selectTextColor,
              }),
              singleValue: (base) => ({
                ...base,
                color: selectTextColor,
              }),
            }}
          />
        </motion.div>
      </Flex>

      {loading ? (
        <Flex
          justify="center"
          align="center"
          h="200px"
          flexDirection={'column'}
        >
          <Progress
            isIndeterminate
            colorScheme="green"
            size="lg"
            width={{ base: '70%', md: '50%' }}
          />
          <span>Please wait....</span>
        </Flex>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {filteredPidData.map((pid) => {
            const isOlderThan24Hours =
              new Date() - new Date(pid.timestamp) > 24 * 60 * 60 * 1000;

            const isLicenseValidDate =
              pid?.dashboardLicense &&
              pid?.dashboardLicense !== '' &&
              new Date(pid.dashboardLicense).toString() !== 'Invalid Date';

            const licenseExpiryDate = isLicenseValidDate
              ? new Date(pid.dashboardLicense)
              : null;

            const daysToExpiry = licenseExpiryDate
              ? Math.ceil(
                  (licenseExpiryDate - new Date()) / (1000 * 60 * 60 * 24),
                )
              : null;

            const isLicenseExpired = daysToExpiry !== null && daysToExpiry <= 0;
            const showDaysToExpiry =
              daysToExpiry !== null && daysToExpiry > 0 && daysToExpiry <= 30;

            const convertReading = (reading) => {
              if (unit === 'Liters') {
                return reading * 1000;
              } else if (unit === 'Gallons') {
                return reading * 264.172;
              }
              return reading;
            };

            const convertFlowrate = (flowrate) => {
              if (unit === 'Liters') {
                return {
                  value: flowrate * 1000,
                  unit: 'L/hr',
                };
              } else if (unit === 'Gallons') {
                return {
                  value: flowrate * 264.172,
                  unit: 'gal/hr',
                };
              }
              return {
                value: flowrate,
                unit: 'm³/hr',
              };
            };

            const totalizerValue = convertReading(pid.totalizer);
            const flowrateData = convertFlowrate(pid.flowrate);
            return (
              <Box
                key={pid.id}
                bg={cardBg}
                border="1px"
                borderColor={cardBorder}
                rounded="lg"
                p={4}
                shadow="md"
                position="relative"
                w="full"
              >
                <div>
                  <Flex justify="space-between" align="left" flexDirection={"column"}>
                    <Box
                      w="calc(100% - 40px)"
                      overflow="hidden"
                      position="relative"
                    >
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        whiteSpace="nowrap"
                        display="inline-block"
                        animation={
                          pid.productName?.length >= 45 ||
                          pid.productId?.length >= 45
                            ? 'marquee 10s linear infinite'
                            : 'none'
                        }
                        overflow="hidden"
                      >
                        {pid.productName !== 'Unknown'
                          ? pid.productName.toUpperCase()
                          : pid.productId}
                      </Text>
                    </Box>
                    {isLicenseExpired ? (
                      <Flex align="center" animation="blink 1.5s infinite">
                        <Box
                          w="8px"
                          h="8px"
                          bg="red.500"
                          borderRadius="full"
                          mr="4px"
                        />
                        <Text fontSize="sm" color="red.500" fontWeight="bold">
                          License Expired
                        </Text>
                      </Flex>
                    ) : showDaysToExpiry ? (
                      <Flex align="center" animation="blink 1.5s infinite">
                        <Box
                          w="8px"
                          h="8px"
                          bg="orange.500"
                          borderRadius="full"
                          mr="4px"
                        />
                        <Text
                          fontSize="sm"
                          color="orange.500"
                          fontWeight="bold"
                        >
                          {daysToExpiry} {daysToExpiry === 1 ? 'day' : 'days'}{' '}
                          to license expiry
                        </Text>
                      </Flex>
                    ) : null}
                  </Flex>

                  <Box mt={4} w="full">
                    <Table
                      variant="simple"
                      size="sm"
                      style={{
                        filter: isLicenseExpired ? 'blur(4px)' : 'none',
                        pointerEvents: isLicenseExpired ? 'none' : 'auto',
                      }}
                      border="1px"
                      borderColor={borderColor}
                      bg={bgColor}
                      rounded="md"
                    >
                      {/* <Thead>
                        <Tr>
                          <Th fontSize="sm" color={fieldColor}>
                            Field
                          </Th>
                          <Th fontSize="sm" color={fieldColor}>
                            Value
                          </Th>
                        </Tr>
                      </Thead> */}
                      <Tbody>
                        <Tr>
                          <Td fontWeight="bold" color={fieldColor}>
                            Location
                          </Td>
                          <Td color={valueColor}>
                            {pid.location ? pid.location : 'N/A'}
                          </Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="bold" color={fieldColor}>
                            Product ID
                          </Td>
                          <Td color={valueColor}>{pid.productId}</Td>
                        </Tr>
                        <Tr>
                          <Td fontWeight="bold" color={fieldColor}>
                            Reading Date
                          </Td>
                          <Td color={valueColor}>
                            {formatDate(pid.timestamp)}
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Box>
                </div>

                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 2 }}
                  spacing={4}
                  mt={4}
                  w={'full'}
                >
                  <Stack
                    spacing={2}
                    align="center"
                    p={4}
                    bgGradient={
                      pid.isRepairing
                        ? 'linear(to-r, yellow.100, yellow.200)'
                        : isOlderThan24Hours
                        ? 'linear(to-r, red.100, red.200)'
                        : 'linear(to-r, green.100, green.200)'
                    }
                    rounded="md"
                    border="1px"
                    borderColor={cardBorder}
                    style={{
                      filter: isLicenseExpired ? 'blur(4px)' : 'none',
                      pointerEvents: isLicenseExpired ? 'none' : 'auto',
                    }}
                  >
                    <Text fontSize="md" fontWeight="bold">
                      TOTALIZER
                    </Text>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }} // Starts slightly below and invisible
                      animate={{ opacity: 1, y: 0 }} // Moves to the original position and fades in
                      transition={{
                        duration: 1, // Duration of the animation (1 second)
                        ease: 'easeInOut', // Smooth easing
                      }}
                    >
                      <LiquidGauge
                        value={
                          (convertReading(pid.totalizer) /
                            Math.max(
                              convertReading(pid.totalizer) * 1.25,
                              10,
                            )) *
                          100
                        }
                        width={130}
                        height={150}
                        textSize={1}
                        waveFrequency={2}
                        waveAmplitude={3}
                        animation={
                          'infinite ease-in-out 1s running waveAnimation'
                        }
                        animationDuration={6000}
                        animationDirection={'alternate'}
                        gradient
                        gradientStops={[
                          { key: '0%', stopColor: '#3498db', offset: '0%' },
                          { key: '100%', stopColor: 'teal', offset: '100%' },
                        ]}
                        circleStyle={{
                          fill: 'lightgray',
                        }}
                        waveStyle={{
                          fill: 'url(#gradient)',
                          animation: 'waveAnimation 2s ease-in-out infinite',
                        }}
                        textRenderer={(value) => {
                          const actualValue = convertReading(pid.totalizer);
                          return (
                            <tspan>
                              <tspan fontSize="11">
                                {actualValue?.toFixed(2)}{' '}
                              </tspan>
                              <tspan fontSize="11">{unit}</tspan>
                            </tspan>
                          );
                        }}
                      />
                    </motion.div>
                  </Stack>

                  <Stack
                    spacing={3}
                    align="center"
                    pt={4}
                    bgGradient={
                      pid.isRepairing
                        ? 'linear(to-r, yellow.100, yellow.200)'
                        : isOlderThan24Hours
                        ? 'linear(to-r, red.100, red.200)'
                        : 'linear(to-r, green.100, green.200)'
                    }
                    rounded="md"
                    borderColor={cardBorder}
                    style={{
                      filter: isLicenseExpired ? 'blur(4px)' : 'none',
                      pointerEvents: isLicenseExpired ? 'none' : 'auto',
                    }}
                  >
                    <Text fontSize="md" fontWeight="bold">
                      FLOWRATE
                    </Text>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      w="auto"
                      h="auto"
                      maxWidth="150px"
                      pt={8}
                      mr={2}
                    >
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={speedometerAnimation}
                      >
                        <ReactSpeedometer
                          value={flowrateData.value}
                          needleColor="rgb(247, 132, 56)"
                          startColor="rgb(183, 223, 244)"
                          endColor="rgb(17, 113, 165)"
                          segments={4}
                          height={170}
                          width={170}
                          minValue={0}
                          maxValue={Math.max(
                            Math.ceil(flowrateData.value * 1.2),
                            10,
                          )}
                          customSegmentStops={[
                            0,
                            Math.max(flowrateData.value * 0.25, 2.5),
                            Math.max(flowrateData.value * 0.5, 5),
                            Math.max(flowrateData.value * 0.75, 7.5),
                            Math.max(flowrateData.value, 10),
                            Math.max(Math.ceil(flowrateData.value * 1.2), 10),
                          ].map((value) => Number(value.toFixed(1)))}
                          forceRender={true}
                          animate={true}
                          animationDuration={9000}
                          animationEasing="easeOutExpo"
                          currentValueText={`${flowrateData.value.toFixed(2)} ${
                            flowrateData.unit
                          }`}
                          textStyle={{
                            fontSize: 'clamp(8px, 1vw, 12px)',
                            fontWeight: '100',
                          }}
                          labelFontSize="clamp(8px, 1vw, 5px)"
                          valueTextFontSize="clamp(15px, 1.2vw, 15px)"
                          arcPadding={0.02}
                          arcWidth={0.3}
                        />
                      </motion.div>
                    </Box>
                  </Stack>
                </SimpleGrid>
              </Box>
            );
          })}
        </SimpleGrid>
      )}

      {pidData.length > 0 && (
        <Flex
          justifyContent={{ base: 'center', md: 'flex-end' }}
          alignItems="center"
          mb={4}
          mt={3}
          direction={{ base: 'column', md: 'row' }}
          gap={{ base: 4, md: 0 }}
        >
          {/* <ChakraSelect
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            width={{ base: '100%', md: '150px' }}
          >
            <option value={null}>Select rows per page</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </ChakraSelect> */}

          <Box mt={{ base: 4, md: 0 }} w={{ base: '100%', md: 'auto' }}>
            {renderPagination()}
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default Dashboard;
