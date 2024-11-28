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

// Register Chart.js components
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
  const toast = useToast();
  const [graphPid, setGraphPid] = useState('');
  const [timeFrame, setTimeFrame] = useState('daily');

  const [graphExpiry, setGraphExpiry] = useState('');

  const selectBg = useColorModeValue('white', 'gray.700');
  const selectTextColor = useColorModeValue('black', 'white');

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
      console.log(error);
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
      console.log(error);
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
      console.log(error);
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
    if (productId === '') {
      toast({
        title: 'Product ID is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (startDate === '') {
      toast({
        title: 'Start Date is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (endDate === '') {
      toast({
        title: 'End Date is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const queryParams = {};
      let filter = {};

      if (startDate && endDate) {
        filter = {
          ...filter,
          startDate: startDate,
          endDate: endDate,
        };
      }

      if (productId) {
        queryParams.productId = productId;
      }
      if (Object.keys(filter).length > 0) {
        queryParams.filter = JSON.stringify(filter);
      }

      const response = await axiosInstance.get(
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
          const result = JSON.parse(reader.result);
          toast({
            title:
              result?.data?.message ||
              'No data found for the specified criteria',
            status: 'info',
            duration: 3000,
            isClosable: true,
          });
        };
        reader.readAsText(response.data);
      } else {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `readings_${productId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
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
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
          styles={{
            container: (base) => ({
              ...base,
              width: '100%',
              maxWidth: '300px',
              marginBottom: '8px',
            }),
            control: (base) => ({
              ...base,
              backgroundColor: selectBg,
              color: selectTextColor,
            }),
          }}
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
          alignItems={{ base: 'stretch', md: 'center' }}
        >
          <Select
            options={productIdOptions}
            value={productIdOptions?.find(
              (option) => option.value === graphPid,
            )}
            onChange={handleSelectGraphChange}
            placeholder="Select Product ID"
            isSearchable={true}
            styles={{
              container: (base) => ({
                ...base,
                width: '100%',
                maxWidth: '350px',
              }),
              control: (base) => ({
                ...base,
                backgroundColor: selectBg,
                color: selectTextColor,
              }),
            }}
          />
          <ChakraSelect
            placeholder={'Select an option'}
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
            w={{ base: '100%', md: 'auto' }}
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </ChakraSelect>
        </Flex>
      </SimpleGrid>

      {loadingGraph ? (
        <Flex justify="center" align="center" h="200px" flexDirection="column">
          <Progress
            isIndeterminate
            colorScheme="green"
            size="lg"
            width={{ base: '70%', md: '50%' }} // Responsive width
          />
          <span>Please wait....</span>
        </Flex>
      ) : (
        <Card
          m="auto"
          w={{ base: '100%', md: '80%', lg: '70%' }} 
          h={{ base: '40vh', md: '50vh', lg: '60vh' }} 
          p={4} 
          style={{
            filter: graphExpiry?.dashboardLicensingExpiry &&
                    new Date(graphExpiry.dashboardLicensingExpiry) < new Date()
              ? 'blur(4px)'
              : 'none',
            pointerEvents: graphExpiry?.dashboardLicensingExpiry &&
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
                styles={{
                  control: (base) => ({
                    ...base,
                    backgroundColor: selectBg,
                    color: selectTextColor,
                  }),
                }}
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
              onClick={() =>
                downloadExcel(selectedProductId, startDate, endDate)
              }
              colorScheme="teal"
              ml={3}
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
