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

const Dashboard = () => {
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
  const inputTextColor = useColorModeValue('gray.600', 'white');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');

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
      console.log(error);
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
      console.log(error);
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
    }
  };

  useEffect(() => {
    getAllProductId();
  }, [selectedCompany]);

  useEffect(() => {
    getDeviceData();
  }, [selectedPID, unit, selectedCompany, page, rowsPerPage]);

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

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const totalConsumption = pidData.reduce(
    (sum, device) => sum + (device.totalizer || 0),
    0,
  );

  return (
    <Box
      pt={{ base: '130px', md: '80px', xl: '80px' }}
      px={{ base: '4', md: '8' }}
    >
      {role === 'companyUser' || role === 'user' ? (
        <Card p={2} mb={4}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            {selectedCompany2?.label}
          </Text>
          <Box mb={2}>
            <Flex gap={2} mb={1}>
              <Text fontSize="lg" fontWeight="bold">
                Total Consumption:
              </Text>
              <Text mt={0.5} fontSize="md" color={textColor}>
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
              height="12px"
              w="20%"
            />
            <Text fontSize="sm" color={withinLimitColor} mt={2}>
              {(
                (totalConsumption / (selectedCompanyData?.allowedLimit || 1)) *
                100
              ).toFixed(1)}
              % of limit
            </Text>
          </Box>
        </Card>
      ) : (
        <Select
          options={companyOptions}
          value={companyOptions.find(
            (option) => option.value === selectedCompany,
          )}
          onChange={(selectedOption) => {
            setPage(1);
            setSelectedCompany2(selectedOption);
            setSelectedCompany(selectedOption.value);
          }}
          placeholder="Search Company"
          isSearchable
          styles={{
            container: (base) => ({
              ...base,
              maxWidth: '50%',
              marginBottom: '16px',
            }),
            control: (base) => ({
              ...base,
              backgroundColor: inputBg,
              color: inputTextColor,
            }),
            placeholder: (base) => ({
              ...base,
              color: placeholderColor,
            }),
          }}
        />
      )}

      {role !== 'companyUser' && role !== 'user' && selectedCompany && (
        <Box mb={8}>
          <Flex gap={2} mb={1}>
            <Text fontSize="lg" fontWeight="bold">
              Total Consumption for {selectedCompany2?.label}:
            </Text>
            <Text fontSize="md" color={textColor}>
              {convertReading(totalConsumption).toFixed(2) +
                ' / ' +
                convertReading(selectedCompanyData?.allowedLimit || 0).toFixed(
                  2,
                )}{' '}
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
            height="12px"
            w="20%"
          />
          <Text fontSize="sm" color={progressColor} mt={2}>
            {(
              (totalConsumption / (selectedCompanyData?.allowedLimit || 1)) *
              100
            ).toFixed(1)}
            % of limit
          </Text>
        </Box>
      )}

      <Flex
        alignItems="center"
        width="full"
        justifyContent={'space-between'}
        mb={4}
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
              width: '200px',
              maxWidth: '300px',
            }),
            control: (base) => ({
              ...base,
              backgroundColor: selectBg,
              color: selectTextColor,
            }),
          }}
        />
        <Select
          options={unitOptions}
          value={unitOptions.find((option) => option.value === unit)}
          onChange={(selectedOption) => setUnit(selectedOption.value)}
          placeholder="Select Unit"
          isSearchable={false}
          styles={{
            container: (base) => ({
              ...base,
              maxWidth: '150px',
            }),
            control: (base) => ({
              ...base,
              backgroundColor: selectBg,
              color: selectTextColor,
            }),
          }}
        />
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
            width={'50%'}
          />
          <span>Please wait....</span>
        </Flex>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {filteredPidData.map((pid) => {
            const isOlderThan24Hours =
              new Date() - new Date(pid.timestamp) > 24 * 60 * 60 * 1000;

            const isLicenseValidDate =
              pid?.dashboardLiscense &&
              pid?.dashboardLiscense !== '' &&
              new Date(pid.dashboardLiscense).toString() !== 'Invalid Date';

            const licenseExpiryDate = isLicenseValidDate
              ? new Date(pid.dashboardLiscense)
              : null;

            const daysToExpiry = licenseExpiryDate
              ? Math.ceil(
                  (licenseExpiryDate - new Date()) / (1000 * 60 * 60 * 24),
                )
              : null;

            const isLicenseExpired = daysToExpiry !== null && daysToExpiry <= 0;
            const showDaysToExpiry =
              daysToExpiry !== null && daysToExpiry > 0 && daysToExpiry <= 30;

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
              >
                <div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Text fontSize="lg" fontWeight="bold">
                      {pid.productId}
                    </Text>
                    {isLicenseExpired ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          animation: 'blink 1.5s infinite',
                        }}
                      >
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
                      </div>
                    ) : showDaysToExpiry ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          animation: 'blink 1.5s infinite',
                        }}
                      >
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
                          {daysToExpiry} days to license expiry
                        </Text>
                      </div>
                    ) : null}
                  </div>

                  <Box mt={4}>
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

                <SimpleGrid columns={2} spacing={4} mt={4}>
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
                    <LiquidGauge
                      value={convertReading(pid.totalizer)}
                      width={200}
                      height={150}
                      textSize={1}
                      waveFrequency={2}
                      waveAmplitude={3}
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
                        transformOrigin: 'center',
                      }}
                      textRenderer={(value) => {
                        const displayValue = parseFloat(value) || 0;
                        return (
                          <tspan>
                            {convertReading(pid.totalizer)?.toFixed(2)} <br />{' '}
                            {unit}
                          </tspan>
                        );
                      }}
                    />
                  </Stack>
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
                      FLOWRATE
                    </Text>
                    <Box
                      bg="gray.300"
                      h="8px"
                      w="full"
                      position="relative"
                      rounded="md"
                      overflow="hidden"
                    >
                      <Box
                        bg="green.400"
                        width={`${convertFlowrate(pid.flowrate).value}%`}
                        h="8px"
                        position="absolute"
                        top="0"
                        left="0"
                      />
                    </Box>
                    <Text fontSize="sm" color="gray.600">
                      {convertFlowrate(pid.flowrate).value.toFixed(2)}{' '}
                      {convertFlowrate(pid.flowrate).unit}
                    </Text>
                  </Stack>
                </SimpleGrid>
              </Box>
            );
          })}
        </SimpleGrid>
      )}

      {pidData.length > 0 && (
        <Flex justifyContent="space-between" alignItems="center" mb={4} mt={3}>
          <ChakraSelect
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            width="150px"
          >
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </ChakraSelect>

          {renderPagination()}
        </Flex>
      )}
    </Box>
  );
};

export default Dashboard;
