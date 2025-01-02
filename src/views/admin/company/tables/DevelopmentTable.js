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
  Skeleton,
  Stack,
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
  const rowHoverBg = useColorModeValue('gray.50', 'gray.600');
  const headerBg = useColorModeValue('white', 'gray.800');
  const shadow = useColorModeValue('md', 'lg');

  const renderTableRows = () => {
    if (loading) {
      return (
        <Tr>
          <Td colSpan="6">
            <Stack spacing="4">
              {[...Array(3)].map((_, i) => (
                <Skeleton height="20px" key={i} />
              ))}
            </Stack>
          </Td>
        </Tr>
      );
    }

    if (!tableData || tableData.length === 0) {
      return (
        <Tr>
          <Td colSpan="6" textAlign="center">
            <Text fontSize="lg" fontWeight="bold" color="gray.500">
              No companies found
            </Text>
          </Td>
        </Tr>
      );
    }

    return tableData.map((company, index) => (
      <Tr
        key={company?._id}
        onClick={() => handleRowClick(company)}
        cursor="pointer"
        _hover={{ backgroundColor: rowHoverBg, boxShadow: shadow }}
      >
        <Td>{index + 1 + (page - 1) * 10}</Td>
        <Td
          isTruncated
          maxWidth="200px"
          title={company?.name}
        >
          {company?.name}
        </Td>
        <Td isTruncated maxWidth="300px">
          {company?.address
            ? [
                company?.address?.addressLine,
                company?.address?.city,
                company?.address?.state,
                company?.address?.country,
                company?.address?.zipcode,
              ]
                .filter((field) => field)
                .join(', ')
            : ''}
        </Td>
        <Td>
          {company?.email1 && <Text>{company?.email1}</Text>}
          {company?.email2 && <Text>{company?.email2}</Text>}
        </Td>
        <Td>
          {company?.contact1 && <Text>{company?.contact1}</Text>}
          {company?.contact2 && <Text>{company?.contact2}</Text>}
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
                handleDeleteUser(company?._id);
              }}
            />
          </Flex>
        </Td>
      </Tr>
    ));
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
    <Card flexDirection="column" w="100%" px="0" overflowX="auto">
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="2xl" fontWeight="bold">
          Companies
        </Text>
      </Flex>
      <Box overflowX="auto" maxHeight="calc(100vh - 150px)">
        <Table colorScheme="gray">
          <Thead position="sticky" top={0} zIndex={1} bg={headerBg} shadow="sm">
            <Tr>
              <Th borderColor={borderColor}>No.</Th>
              <Th borderColor={borderColor}>Company Name</Th>
              <Th borderColor={borderColor}>Address</Th>
              <Th borderColor={borderColor}>Contact Emails</Th>
              <Th borderColor={borderColor}>Contact Numbers</Th>
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
  handleRowClick: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default DevelopmentTable;
