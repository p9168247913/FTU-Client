import React from 'react';
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  IconButton,
  Button,
  useColorModeValue,
  Card,
  Spinner,
  CircularProgress,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';

const DevelopmentTable = ({
  tableData,
  handlePageChange,
  handleRowClick,
  page,
  totalPages,
  loading,
}) => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const rowHoverBg = useColorModeValue('gray.100', 'gray.700');
  const theadBgColor = useColorModeValue('gray.100', 'gray.800'); // Dynamically adapt to color mode
  const theadTextColor = useColorModeValue('gray.900', 'whiteAlpha.900');
  const roundToTwoDecimalPlaces = (value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      throw new Error('Input must be a number or a numeric string');
    }
    return Math.round(numericValue * 100) / 100;
  };

  const renderTableRows = () => {
    if (loading) {
      return (
        <Tr style={{zIndex: 0}}>
          <Td colSpan="7" textAlign="center">
            <CircularProgress
              isIndeterminate
              size="30px"
              thickness="6px"
              color="teal.500"
              trackColor="gray.200"
            />
          </Td>
        </Tr>
      );
    }

    if (!tableData || tableData.length === 0) {
      return (
        <Tr>
          <Td colSpan="7" textAlign="center">
            <Text>No data found</Text>
          </Td>
        </Tr>
      );
    }

    return tableData.map((item, index) => {
      const isLicenseExpired =
        item.dashboardLiscense &&
        item.dashboardLiscense !== '' &&
        new Date(item.dashboardLiscense) < new Date();
      return (
        <Tr
          key={item.productId}
          onClick={() => handleRowClick(item)}
          cursor="pointer"
          _hover={{ backgroundColor: rowHoverBg }}
        >
          <Td>{item.productId}</Td>
          <Td
            style={{
              filter: isLicenseExpired ? 'blur(4px)' : 'none',
              pointerEvents: isLicenseExpired ? 'none' : 'auto',
            }}
          >
            {item.location ? item.location.name : 'N/A'}
          </Td>
          <Td
            style={{
              filter: isLicenseExpired ? 'blur(4px)' : 'none',
              pointerEvents: isLicenseExpired ? 'none' : 'auto',
            }}
          >
            {roundToTwoDecimalPlaces(item.todayTotal)}
          </Td>
          {/* <Td>{roundToTwoDecimalPlaces(item.weeklyCumulative)}</Td> */}
          <Td
            style={{
              filter: isLicenseExpired ? 'blur(4px)' : 'none',
              pointerEvents: isLicenseExpired ? 'none' : 'auto',
            }}
          >
            {roundToTwoDecimalPlaces(item.monthlyCumulative)}
          </Td>
          <Td
            style={{
              filter: isLicenseExpired ? 'blur(4px)' : 'none',
              pointerEvents: isLicenseExpired ? 'none' : 'auto',
            }}
          >
            {roundToTwoDecimalPlaces(item.annualCumulative)}
          </Td>
        </Tr>
      );
    });
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

  return (
    <Card
      flexDirection="column"
      w="100%"
      px="0px"
      overflowX="auto"
      pt={3}
      pb={3}
      mb={4}
    >
      <Box style={{ maxHeight: '500px' }} overflowX="auto">
        <Table variant="simple" color="gray.500" mb={2}>
          <Thead
            style={{
              backgroundColor: "white",
              color: theadTextColor,
              position: 'sticky',
              top: '0',
              // zIndex: 1, 
            }}
          >
            <Tr>
              <Th borderColor={borderColor}>PID</Th>
              <Th borderColor={borderColor} whiteSpace="nowrap">
                Location Name
              </Th>
              <Th borderColor={borderColor} whiteSpace="nowrap">
                Today Total{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    fontSize: '0.9em',
                    textTransform: 'none',
                  }}
                >
                  (m³)
                </span>
              </Th>
              {/* <Th borderColor={borderColor}>Weekly Cumulative</Th> */}
              <Th borderColor={borderColor} whiteSpace="nowrap">
                Monthly Cumulative{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    fontSize: '0.9em',
                    textTransform: 'none',
                  }}
                >
                  (m³)
                </span>
              </Th>
              <Th borderColor={borderColor} whiteSpace="nowrap">
                Annual Cumulative{' '}
                <span
                  style={{
                    fontWeight: 'normal',
                    fontSize: '0.9em',
                    textTransform: 'none',
                  }}
                >
                  (m³)
                </span>
              </Th>
            </Tr>
          </Thead>
          <Tbody>{renderTableRows()}</Tbody>
        </Table>
      </Box>
      {renderPagination()}
    </Card>
  );
};

DevelopmentTable.propTypes = {
  tableData: PropTypes.array.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handleRowClick: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default DevelopmentTable;
