import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  Select as ChakraSelect,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  SimpleGrid,
  InputLeftElement,
  Progress,
  InputGroup,
  useToast,
  Card,
  useColorMode,
  Skeleton,
  // keyframes,
  Text,
} from '@chakra-ui/react';
import Select from 'react-select';
import { useColorModeValue } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, set } from 'date-fns';
import DevelopmentTable from './tables/DevelopmentTable';
import { SearchIcon, DownloadIcon } from '@chakra-ui/icons';
import axiosInstance from 'axiosInstance';
import baseUrl from 'Base_Url/baseUrl';
import axios from 'axios';
import moment from 'moment-timezone';
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const AnalyticsPage = () => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pid, setPid] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [graphData, setGraphData] = useState({ labels: [], datasets: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [loadingProductId, setLoadingProductId] = useState(false);
  const Token = localStorage.getItem('token');
  const [productId, setProductId] = useState([]);
  const [selectedPID, setSelectedPID] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [pidData, setPidData] = useState([]);
  const [totalResult, setTotalResult] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const productIdOptions = [{ value: '', label: 'All' }, ...productId];
  const productIdOptions2 = [...productId];
  const toast = useToast();
  const [graphPid, setGraphPid] = useState('');
  const [timeFrame, setTimeFrame] = useState('daily');
  const { colorMode } = useColorMode();
  const [graphExpiry, setGraphExpiry] = useState('');

  const selectBg = useColorModeValue('white', 'gray.700');
  const selectTextColor = useColorModeValue('black', 'white');
  const barColor = useColorModeValue('blue.400', 'blue.600');

  const customStyles = {
    container: (base) => ({
      ...base,
      width: '100%',
      // zIndex: '3',
      maxWidth: '400px',
      marginBottom: '8px',
    }),
    control: (base, state) => ({
      ...base,
      backgroundColor: colorMode === 'dark' ? '#2D3748' : '#ffffff',
      borderRadius: '20px',
      color: colorMode === 'dark' ? '#E2E8F0' : '#2D3748',
      borderColor: state.isFocused
        ? colorMode === 'dark'
          ? '#63B3ED'
          : '#3182CE'
        : '#CBD5E0',
      boxShadow: state.isFocused ? '0 0 0 1px #63B3ED' : 'none',
      '&:hover': {
        borderColor: colorMode === 'dark' ? '#63B3ED' : '#3182CE',
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: colorMode === 'dark' ? '#E2E8F0' : '#2D3748',
    }),
    placeholder: (base) => ({
      ...base,
      color: colorMode === 'dark' ? '#A0AEC0' : '#A0AEC0',
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: colorMode === 'dark' ? '#2D3748' : '#ffffff',
      color: colorMode === 'dark' ? '#E2E8F0' : '#2D3748',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused
        ? colorMode === 'dark'
          ? '#4A5568'
          : '#EDF2F7'
        : 'transparent',
      color: state.isSelected
        ? colorMode === 'dark'
          ? '#63B3ED'
          : '#3182CE'
        : base.color,
      '&:hover': {
        backgroundColor: colorMode === 'dark' ? '#4A5568' : '#EDF2F7',
      },
    }),
  };

  const getQueryString = (params) => {
    return Object.keys(params)
      .filter((key) => params[key] !== undefined && params[key] !== '')
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
  };

  const getAllProductId = async () => {
    setLoadingProductId(true);
    try {
      const queryParams = {};
      let filter = {};

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
    } finally {
      setLoadingProductId(false);
    }
  };

  const getDeviceData = async () => {
    setLoading(true);
    try {
      const queryParams = {
        page: page ? page : 1,
        limit: rowsPerPage,
      };
      let filter = {};

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

  const getGraphData = async () => {
    if (!graphPid) return;
    setLoadingGraph(true);
    try {
      const response = await axiosInstance.get(
        `${baseUrl}/device-readings/graph?productId=${graphPid}&timeframe=${timeFrame}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      );
      if (response) {
        const data = response?.data?.data?.data || [];

        setGraphExpiry(response?.data?.data);

        const today = new Date();
        const filteredData =
          timeFrame === 'daily'
            ? data.filter((item) => new Date(item.key) <= today)
            : data;

        const labels =
          timeFrame === 'monthly'
            ? filteredData.map((item) =>
                new Date(item.key).toLocaleString('default', {
                  month: 'short',
                }),
              )
            : timeFrame === 'daily'
            ? filteredData.map((item) => {
                const date = new Date(item.key);
                return `${date
                  .getDate()
                  .toString()
                  .padStart(2, '0')} ${date.toLocaleString('default', {
                  month: 'short',
                })}`;
              })
            : filteredData.map((item) => item.key);

        const usageData = filteredData.map((item) => item.usage);

        setGraphData({
          labels,
          datasets: [
            {
              label: `Usage Data (${
                timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)
              })`,
              data: usageData,
              backgroundColor: 'rgba(75, 192, 192, 0.4)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
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
      setLoadingGraph(false);
    }
  };

  useEffect(() => {
    getDeviceData();
  }, [selectedPID, page, rowsPerPage]);

  useEffect(() => {
    getAllProductId();
  }, []);

  const handleSelectChange = (selectedOption) => {
    setSelectedPID(selectedOption.value);
  };

  const handleSelectGraphChange = (selectedOption) => {
    setGraphPid(selectedOption.value);
  };

  const handleModalSelectChange = (selectedOption) => {
    setSelectedProductId(selectedOption.value);
  };

  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
  };

  const downloadExcel = async (productId, startDate, endDate) => {
    setLoading(true);
    if (productId === '') {
      toast({
        title: 'Product ID is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (startDate === '') {
      toast({
        title: 'Start Date is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }
    if (endDate === '') {
      toast({
        title: 'End Date is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const queryParams = {};
      let filter = {};

      if (startDate && endDate) {
        const formattedStartDate = moment
          .tz(startDate, 'Asia/Kolkata')
          .format('YYYY-MM-DD');
        const formattedEndDate = moment
          .tz(endDate, 'Asia/Kolkata')
          .format('YYYY-MM-DD');

        filter = {
          ...filter,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        };
      }

      if (productId) {
        queryParams.productId = productId;
      }
      if (Object.keys(filter).length > 0) {
        queryParams.filter = JSON.stringify(filter);
      }

      const response = await axios.get(
        `${baseUrl}/device-readings/download?${getQueryString(queryParams)}`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
          responseType: 'blob',
        },
      );

      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const result = JSON.parse(reader.result);
            toast({
              title: result?.data || 'Error occurred while downloading data',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          } catch (e) {
            toast({
              title: 'Invalid response received from server',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          }
        };
        reader.readAsText(response.data);
        setLoading(false);
      } else {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `readings_${productId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setIsModalOpen(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      if (error?.status === 403) {
        toast({
          title: 'License expired for this device',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      toast({
        title:
          error?.response?.data?.data ||
          error?.response?.data?.message ||
          'Failed to download the report',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      setStartDate('');
      setEndDate('');
      setSelectedProductId('');
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (productId.length > 0 && !graphPid) {
      setGraphPid(productId[0].value);
    }
  }, [productId]);

  useEffect(() => {
    if (graphPid) {
      getGraphData();
    }
  }, [graphPid, timeFrame]);

  return (
    <Box
      pt={{ base: '140px', md: '90px', xl: '90px', sm: '100px' }}
      px={{ base: '4', md: '8' }}
    >
      <Flex
        justify={{ base: 'center', md: 'space-between' }}
        align={{ base: 'stretch', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        mb={4}
        gap={{ base: 4, md: 0 }}
      >
        <Select
          options={productIdOptions}
          value={productIdOptions?.find(
            (option) => option.value === selectedPID,
          )}
          onChange={handleSelectChange}
          placeholder="Select Product ID"
          isSearchable={true}
          styles={customStyles}
        />

        <Button
          p={5}
          leftIcon={<DownloadIcon />}
          colorScheme="green"
          onClick={() => setIsModalOpen(true)}
          w={{ base: '100%', md: 'auto' }}
        >
          Download Report
        </Button>
      </Flex>

      <DevelopmentTable
        tableData={pidData}
        handlePageChange={(newPage) => setPage(newPage)}
        handleRowClick={(row) => console.log('Row clicked:', row)}
        page={page}
        totalPages={totalPages}
        loading={loading}
      />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          mb={4}
          gap={4}
          justifyContent={{ base: 'center', md: 'space-between' }}
        >
          <Select
            options={productIdOptions2}
            value={productIdOptions2?.find(
              (option) => option.value === graphPid,
            )}
            onChange={handleSelectGraphChange}
            placeholder="Select Product ID"
            isSearchable={true}
            styles={customStyles}
          />
          <ChakraSelect
            placeholder={'Select timeline'}
            value={timeFrame}
            onChange={(e) => handleTimeFrameChange(e.target.value)}
            size="md"
            variant="outline"
            borderColor="gray.300"
            focusBorderColor="blue.500"
            bg={useColorModeValue('white', 'gray.700')}
            color={useColorModeValue('black', 'white')}
            _placeholder={{
              color: useColorModeValue('gray.500', 'gray.400'),
            }}
            w={{ base: '200px', md: 'auto' }}
            borderRadius="20px"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </ChakraSelect>
        </Flex>
      </SimpleGrid>

      {loadingGraph ? (
        <Card
          m="auto"
          w={{ base: '100%', md: '80%', lg: '70%' }}
          h={{ base: '40vh', md: '50vh', lg: '60vh' }}
          p={4}
          shadow="md"
        >
          <Flex
            direction="column"
            h="100%"
            justify="space-between"
            align="center"
          >
            <Text fontSize="lg" fontWeight="bold" mb={4} color="gray.500">
              Loading Graph...
            </Text>

            <Flex w="100%" h="80%" justify="space-around" align="flex-end">
              {Array.from({ length: 8 }).map((_, index) => (
                <Box
                  key={index}
                  w="10%"
                  h="20%"
                  bg={barColor}
                  sx={{
                    animation: `barAnimation ${1.5}s ease-in-out ${
                      index * 0.2
                    }s infinite`,
                    '@keyframes barAnimation': {
                      '0%': {
                        height: '20%',
                        backgroundColor: 'rgb(212, 213, 215)',
                      },
                      '50%': {
                        height: '80%',
                        backgroundColor: 'rgb(66, 225, 148)',
                      },
                      '100%': {
                        height: '20%',
                        backgroundColor: 'rgb(212, 213, 215)',
                      },
                    },
                  }}
                  borderRadius="md"
                />
              ))}
            </Flex>

            <Box mt={4} h="4px" w="100%" bg="gray.300" />
          </Flex>
        </Card>
      ) : (
        <Card
          m="auto"
          w={{ base: '100%', md: '80%', lg: '70%' }}
          h={{ base: '40vh', md: '50vh', lg: '60vh' }}
          p={4}
          style={{
            filter:
              graphExpiry?.dashboardLicensingExpiry &&
              new Date(graphExpiry.dashboardLicensingExpiry) < new Date()
                ? 'blur(4px)'
                : 'none',
            pointerEvents:
              graphExpiry?.dashboardLicensingExpiry &&
              new Date(graphExpiry.dashboardLicensingExpiry) < new Date()
                ? 'none'
                : 'auto',
          }}
        >
          {graphData?.labels.length > 0 ? (
            <Bar
              data={graphData}
              style={{
                margin: 'auto',
                width: '100%',
                height: '100%',
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: `Graph Data for ${graphPid} (${timeFrame})`,
                  },
                },
              }}
            />
          ) : (
            <Flex justifyContent="center" alignItems="center" h="100%">
              <p>No data available for the selected product and timeframe.</p>
            </Flex>
          )}
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Download Report</ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>PID / All Selection</FormLabel>
              <Select
                options={productIdOptions}
                value={productIdOptions?.find(
                  (option) => option.value === selectedProductId,
                )}
                onChange={handleModalSelectChange}
                placeholder="Select Product ID"
                isSearchable={true}
                styles={{ ...customStyles, width: '100%' }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && new Date(e.target.value) > new Date(endDate)) {
                    // Reset endDate if it is less than startDate
                    setEndDate('');
                  }
                }}
                bg={useColorModeValue('white', 'gray.700')}
                color={useColorModeValue('black', 'white')}
                _placeholder={{
                  color: useColorModeValue('gray.500', 'gray.400'),
                }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate} // Prevent selecting an earlier date than startDate
                disabled={!startDate} // Disable if startDate is not selected
                bg={useColorModeValue('white', 'gray.700')}
                color={useColorModeValue('black', 'white')}
                _placeholder={{
                  color: useColorModeValue('gray.500', 'gray.400'),
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                downloadExcel(selectedProductId, startDate, endDate);
              }}
              colorScheme="teal"
              ml={3}
              isLoading={loading}
            >
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AnalyticsPage;
