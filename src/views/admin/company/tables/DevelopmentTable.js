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
} from '@chakra-ui/react';
import {
  EditIcon,
  DeleteIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import Card from 'components/card/Card';
import PropTypes from 'prop-types';

const DevelopmentTable = ({
  tableData,
  handleEditUser,
  handleDeleteUser,
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
            <Text>No companies found</Text>
          </Td>
        </Tr>
      );
    }

    return tableData.map((company, index) => (
      <Tr
        key={company._id}
        onClick={() => handleRowClick(company)}
        cursor="pointer"
        _hover={{ backgroundColor: rowHoverBg }}
      >
        <Td>{index + 1 + (page - 1) * 10}</Td>
        <Td
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {company.name}
        </Td>
        {/* <Td>{company.companyId}</Td> */}
        <Td whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
          {`${company.address.addressLine}, ${company.address.city}, ${company.address.state}, ${company.address.country}-${company.address.zipcode}`}
        </Td>
        <Td>
          {company.email1} <br /> {company.email2}
        </Td>
        <Td>
          {company.contact1} <br /> {company.contact2}
        </Td>
        <Td>
          <Flex gap="2">
            <IconButton
              aria-label="Edit"
              icon={<EditIcon />}
              size="sm"
              colorScheme="blue"
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(company);
              }}
            />
            <IconButton
              aria-label="Delete"
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUser(company._id);
              }}
            />
          </Flex>
        </Td>
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
    <Card flexDirection="column" w="100%" px="0px" overflowX="auto">
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700">
          Companies
        </Text>
      </Flex>
      <Box>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead>
            <Tr>
              <Th borderColor={borderColor}>No.</Th>
              <Th borderColor={borderColor} whiteSpace="nowrap">
                Company Name
              </Th>
              {/* <Th borderColor={borderColor} whiteSpace="nowrap">
                Company ID
              </Th> */}
              <Th borderColor={borderColor}>Address</Th>
              <Th borderColor={borderColor} whiteSpace="nowrap">
                Contact Emails
              </Th>
              <Th borderColor={borderColor} whiteSpace="nowrap">
                Contact Numbers
              </Th>
              <Th borderColor={borderColor}>Actions</Th>
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
  handleEditUser: PropTypes.func.isRequired,
  handleDeleteUser: PropTypes.func.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handleRowClick: PropTypes.func.isRequired, // Added prop type validation
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default DevelopmentTable;
