import {
  Box,
  Flex,
  Text,
  Select,
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
} from '@chakra-ui/react';
import LiquidGauge from 'react-liquid-gauge';
import { useState } from 'react';
import { format } from 'date-fns';
import { SearchIcon } from '@chakra-ui/icons';

const Dashboard = () => {
  const [consumptionLimit, setConsumptionLimit] = useState('100');
  const [selectedPID, setSelectedPID] = useState('');
  const [unit, setUnit] = useState('m³');
  const [selectedCompany, setSelectedCompany] = useState('Company A');
  const companies = ['Company A', 'Company B', 'Company C'];

  const units = ['m³', 'Liters', 'Gallons'];

  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  const sectionBg = useColorModeValue('gray.100', 'gray.800');

  const pidData = [
    { id: 'ID00001', location: 'Location 1', pid: 'ID00001', reading: 55.2 },
    { id: 'ID00002', location: 'Location 2', pid: 'ID00002', reading: 60.5 },
    { id: 'ID00003', location: 'Location 3', pid: 'ID00003', reading: 70.8 },
    { id: 'ID00004', location: 'Location 4', pid: 'ID00004', reading: 38.6 },
    { id: 'ID00005', location: 'Location 5', pid: 'ID00005', reading: 82.3 },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const companyData = [
    { name: 'Company A', limit: 1000, consumption: 700 },
    { name: 'Company B', limit: 1500, consumption: 1800 },
    { name: 'Company C', limit: 2000, consumption: 900 },
  ];

  const withinLimitColor = useColorModeValue('green.400', 'green.300');
  const exceededLimitColor = useColorModeValue('red.400', 'red.300');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const progressBg = useColorModeValue('gray.200', 'gray.700');

  const selectedCompanyData = companyData.find(
    (company) => company.name === selectedCompany,
  );

  const inputBg = useColorModeValue('white', 'gray.700');
  const inputTextColor = useColorModeValue('black', 'white');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const dropdownBg = useColorModeValue('white', 'gray.700');

  const progressPercentage = selectedCompanyData
    ? (selectedCompanyData.consumption / selectedCompanyData.limit) * 100
    : 0;
  const progressColor = selectedCompanyData
    ? selectedCompanyData.consumption <= selectedCompanyData.limit
      ? withinLimitColor
      : exceededLimitColor
    : withinLimitColor;

  const filteredPidData = selectedPID
    ? pidData.filter((pid) => pid.pid === selectedPID)
    : pidData;

  const convertReading = (reading) => {
    if (unit === 'Liters') {
      return reading * 1000;
    } else if (unit === 'Gallons') {
      return reading * 264.172;
    }
    return reading;
  };

  const formatDate = (timestamp) => {
    return format(new Date(timestamp), 'do MMM, yyyy hh:mm a');
  };

  return (
    <Box
      pt={{ base: '130px', md: '80px', xl: '80px' }}
      px={{ base: '4', md: '8' }}
    >
      <InputGroup mb={4} maxW="50%">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search Company"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 100)}
          bg={inputBg}
          color={inputTextColor}
          _placeholder={{
            color: placeholderColor,
          }}
        />
      </InputGroup>
      {isDropdownOpen && (
        <Box
          position="absolute"
          zIndex="1"
          bg={dropdownBg}
          border="1px solid"
          borderColor="gray.200"
          rounded="md"
          mt={1}
          maxH="200px"
          overflowY="auto"
          w="100%"
          maxW="50%"
        >
          <List>
            {companies
              .filter((company) =>
                company.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((company) => (
                <ListItem
                  key={company}
                  px={4}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => {
                    setSelectedCompany(company);
                    setSearchQuery(company);
                    setIsDropdownOpen(false);
                  }}
                >
                  {company}
                </ListItem>
              ))}
          </List>
        </Box>
      )}

      <Box mb={8}>
        <Flex gap={2} mb={1}>
          <Text fontSize="lg" fontWeight="bold">
            Total Consumption of {selectedCompanyData.name}
          </Text>
          <Text fontSize="md" color={textColor}>
            {selectedCompanyData.consumption} / {selectedCompanyData.limit} m³
          </Text>
        </Flex>
        <Progress
          value={progressPercentage}
          colorScheme={
            selectedCompanyData.consumption <= selectedCompanyData.limit
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
          {progressPercentage.toFixed(1)}% of limit
        </Text>
      </Box>

      <Flex
        alignItems="center"
        width="full"
        justifyContent={'space-between'}
        mb={5}
      >
        <Select
          placeholder="Select PID"
          value={selectedPID}
          onChange={(e) => setSelectedPID(e.target.value)}
          maxW="200px"
          bg={useColorModeValue('white', 'gray.700')}
          color={useColorModeValue('black', 'white')}
          _placeholder={{
            color: useColorModeValue('gray.500', 'gray.400'),
          }}
        >
          {pidData.map((pid) => (
            <option key={pid.id} value={pid.pid}>
              {pid.pid}
            </option>
          ))}
        </Select>
        <Select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          maxW="150px"
          bg={useColorModeValue('white', 'gray.700')}
          color={useColorModeValue('black', 'white')}
          _placeholder={{
            color: useColorModeValue('gray.500', 'gray.400'),
          }}
        >
          {units.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </Select>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {filteredPidData.map((pid) => (
          <Box
            key={pid.id}
            bg={cardBg}
            border="1px"
            borderColor={cardBorder}
            rounded="lg"
            p={4}
            shadow="md"
          >
            <div>
              <Text fontSize="lg" fontWeight="bold">
                {pid.id}
              </Text>
              <Text fontSize="sm" color="gray.500">
                * {pid.location}
              </Text>
              <Text fontSize="sm" color="gray.500">
                * {pid.pid}
              </Text>
              <Text fontSize="sm" color="gray.500">
                * {formatDate(Date.now())}
              </Text>
            </div>

            <SimpleGrid columns={2} spacing={4} mt={4}>
              <Stack
                spacing={2}
                align="center"
                p={4}
                bg={sectionBg}
                rounded="md"
                border="1px"
                borderColor={cardBorder}
              >
                <Text fontSize="md" fontWeight="bold">
                  TOTALIZER
                </Text>
                <LiquidGauge
                  value={Math.min(convertReading(pid.reading), 100)} // Clamp to 100% max
                  width={100}
                  height={100}
                  textSize={1}
                  waveFrequency={2}
                  waveAmplitude={3}
                  gradient
                  gradientStops={[
                    { key: '0%', stopColor: '#3498db', offset: '0%' }, // Blue for water
                    { key: '100%', stopColor: 'blue', offset: '100%' },
                  ]}
                  circleStyle={{
                    fill: 'lightgray', // Light gray background for the empty part
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
                       {convertReading(pid.reading).toFixed(2)} {unit}
                      </tspan>
                    );
                  }}
                />

                <style>
                  {`
    @keyframes waveAnimation {
      0% { transform: translateY(5px); }
      50% { transform: translateY(-5px); }
      100% { transform: translateY(5px); }
    }
  `}
                </style>

                <style>
                  {`
    @keyframes waveAnimation {
      0% {
        transform: translateY(5%);
      }
      50% {
        transform: translateY(-50%);
      }
      100% {
        transform: translateY(5%);
      }
    }
  `}
                </style>
              </Stack>
              <Stack
                spacing={2}
                align="center"
                p={4}
                bg={sectionBg}
                rounded="md"
                border="1px"
                borderColor={cardBorder}
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
                    width={`${convertReading(pid.reading)}%`}
                    h="8px"
                    position="absolute"
                    top="0"
                    left="0"
                  />
                </Box>
                <Text fontSize="sm" color="gray.600">
                  {convertReading(pid.reading).toFixed(2)} {unit}
                </Text>
              </Stack>
            </SimpleGrid>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
