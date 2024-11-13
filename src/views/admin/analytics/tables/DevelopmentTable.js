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

  const renderTableRows = () => {
    if (loading) {
      return (
        <Tr>
          <Td colSpan="7" textAlign="center">
            <Text>Loading...</Text>
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

    return tableData.map((item, index) => (
      <Tr
        key={item._id}
        onClick={() => handleRowClick(item)}
        cursor="pointer"
        _hover={{ backgroundColor: rowHoverBg }}
      >
        {/* <Td>{index + 1 + (page - 1) * 10}</Td> */}
        <Td>{item.companyId}</Td>
        <Td>{item.name}</Td>
        <Td>{item.today}</Td>
        <Td>{item.weekly}</Td>
        <Td>{item.monthly}</Td>
        <Td>{item.annual}</Td>
      </Tr>
    ));
  };

  const renderPagination = () => (
    <Flex mt="4" justify="center" align="center">
      <IconButton
        aria-label="Previous Page"
        icon={<ChevronLeftIcon />}
        isDisabled={page <= 1}
        onClick={() => handlePageChange(page - 1)}
        mr="2"
      />
      {Array.from({ length: totalPages }, (_, index) => (
        <Button
          key={index + 1}
          onClick={() => handlePageChange(index + 1)}
          colorScheme={page === index + 1 ? 'blue' : 'gray'}
          variant={page === index + 1 ? 'solid' : 'outline'}
          mx="1"
        >
          {index + 1}
        </Button>
      ))}
      <IconButton
        aria-label="Next Page"
        icon={<ChevronRightIcon />}
        isDisabled={page >= totalPages}
        onClick={() => handlePageChange(page + 1)}
        ml="2"
      />
    </Flex>
  );

  return (
    <Card flexDirection="column" w="100%" px="0px" overflowX="auto" pt={3} pb={3} mb={4}>
      {/* <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700">
          Data Table
        </Text>
      </Flex> */}
      <Box overflowX="auto" >
        <Table variant="simple" color="gray.500" mb={2} mt="12px">
          <Thead>
            <Tr>
              {/* <Th borderColor={borderColor}>No.</Th> */}
              <Th borderColor={borderColor}>PID</Th>
              <Th borderColor={borderColor}>Location Name</Th>
              <Th borderColor={borderColor}>Today Total</Th>
              <Th borderColor={borderColor}>Weekly Cumulative</Th>
              <Th borderColor={borderColor}>Monthly Cumulative</Th>
              <Th borderColor={borderColor}>Annual Cumulative</Th>
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
