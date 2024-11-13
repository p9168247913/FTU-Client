import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Input,
  Button,
  Select,
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
  InputGroup,
} from '@chakra-ui/react';
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
import DevelopmentTable from './tables/DevelopmentTable';
import { SearchIcon, DownloadIcon } from '@chakra-ui/icons';

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

  // Table Data
  const tableData = [
    {
      _id: 'ID123',
      name: 'Location A',
      companyId: 'ID123',
      today: 10,
      weekly: 50,
      monthly: 200,
      annual: 2400,
    },
    {
      _id: 'ID124',
      name: 'Location B',
      companyId: 'ID124',
      today: 20,
      weekly: 70,
      monthly: 300,
      annual: 2800,
    },
    {
      _id: 'ID125',
      name: 'Location C',
      companyId: 'ID125',
      today: 15,
      weekly: 60,
      monthly: 250,
      annual: 2600,
    },
    {
      _id: 'ID126',
      name: 'Location D',
      companyId: 'ID126',
      today: 25,
      weekly: 80,
      monthly: 400,
      annual: 3000,
    },
    {
      _id: 'ID127',
      name: 'Location E',
      companyId: 'ID127',
      today: 30,
      weekly: 90,
      monthly: 500,
      annual: 3200,
    },
  ];

  const totalPages = 1;

  // Initialize graph data with all entries
  useEffect(() => {
    generateGraph('All');
  }, []);

  const generateGraph = (selectedPid = pid) => {
    const filteredData = tableData.filter(
      (item) => selectedPid === 'All' || item.companyId === selectedPid,
    );

    const labels = filteredData.map((item) => item.name);
    const data = filteredData.map((item) => item.today);

    setGraphData({
      labels,
      datasets: [
        {
          label:
            selectedPid === 'All' ? 'Data for All' : `Data for ${selectedPid}`,
          data,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    });
  };

  const handlePidChange = (newPid) => {
    setPid(newPid);
    generateGraph(newPid);
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex justify="space-between" mb={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search for PID or Location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxW="300px"
            bg={useColorModeValue('white', 'gray.700')}
            color={useColorModeValue('black', 'white')}
            _placeholder={{
              color: useColorModeValue('gray.500', 'gray.400'),
            }}
          />
        </InputGroup>

        <Button
        p={5}
          leftIcon={<DownloadIcon />}
          colorScheme="green"
          onClick={() => setIsModalOpen(true)}
        >
          Download Report
        </Button>
      </Flex>

      <DevelopmentTable
        tableData={tableData.filter(
          (item) =>
            item.companyId.toLowerCase().includes(search.toLowerCase()) ||
            item.name.toLowerCase().includes(search.toLowerCase()),
        )}
        handlePageChange={(newPage) => setPage(newPage)}
        handleRowClick={(row) => console.log('Row clicked:', row)}
        page={page}
        totalPages={totalPages}
        loading={loading}
      />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Flex mb={4} gap={4} justifyContent={'space-between'}>
          <Select
            placeholder="Select PID"
            value={pid}
            onChange={(e) => handlePidChange(e.target.value)}
            bg={useColorModeValue('white', 'gray.700')}
            color={useColorModeValue('black', 'white')}
            _placeholder={{
              color: useColorModeValue('gray.500', 'gray.400'),
            }}
          >
            <option value="All">All</option>
            {tableData.map((item) => (
              <option key={item.companyId} value={item.companyId}>
                {item.companyId}
              </option>
            ))}
          </Select>
          <Input
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            bg={useColorModeValue('white', 'gray.700')}
            color={useColorModeValue('black', 'white')}
            _placeholder={{
              color: useColorModeValue('gray.500', 'gray.400'),
            }}
          />
          {/* <Button width="100%" colorScheme="blue" onClick={() => generateGraph()}>
            Generate Graph
          </Button> */}
        </Flex>
      </SimpleGrid>

      <Box m="auto" w="70%" h="auto">
        <Bar data={graphData} />
      </Box>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Download Report</ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>PID / All Selection</FormLabel>
              <Select
                value={pid}
                onChange={(e) => handlePidChange(e.target.value)}
              >
                <option value="All">All</option>
                {tableData.map((item) => (
                  <option key={item.companyId} value={item.companyId}>
                    {item.companyId}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                bg={useColorModeValue('white', 'gray.700')}
                color={useColorModeValue('black', 'white')}
                _placeholder={{
                  color: useColorModeValue('gray.500', 'gray.400'),
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
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
            <Button colorScheme="teal" ml={3}>
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AnalyticsPage;
