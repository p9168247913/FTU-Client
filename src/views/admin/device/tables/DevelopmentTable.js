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
  page,
  totalPages,
  loading,
}) => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const headerBg = useColorModeValue('gray.50', 'gray.800');
  const rowHoverBg = useColorModeValue('gray.100', 'gray.700');

  const renderTableRows = () => {
    if (loading) {
      return Array.from({ length: 5 }, (_, index) => (
        <Tr key={index}>
          {Array.from({ length: 6 }, (_, colIndex) => (
            <Td key={colIndex}>
              <Skeleton height="20px" />
            </Td>
          ))}
        </Tr>
      ));
    }

    if (!tableData || tableData.length === 0) {
      return (
        <Tr>
          <Td colSpan="6" textAlign="center">
            <Text fontSize="lg" fontWeight="medium" color="gray.500">
              No devices found
            </Text>
          </Td>
        </Tr>
      );
    }

    return tableData.map((device, index) => (
      <Tr
        key={device?._id}
        _hover={{ bg: rowHoverBg, transform: 'scale(1.01)' }}
        transition="transform 0.2s"
      >
        <Td>{index + 1 + (page - 1) * 10}</Td>
        <Td whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {device?.productId}
        </Td>
        <Td>{device?.productName}</Td>
        <Td textOverflow="ellipsis" overflow="hidden">
          {device?.company?.name || 'N/A'}
        </Td>
        <Td>{device?.productType?.type || 'N/A'}</Td>
        <Td>
          <Flex gap="2">
            <IconButton
              aria-label="Edit"
              icon={<EditIcon />}
              size="sm"
              colorScheme="blue"
              onClick={(e) => {
                handleEditUser(device, e);
              }}
            />
            <IconButton
              aria-label="Delete"
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUser(device?._id, e);
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
    <Card flexDirection="column" w="100%" px="0px" overflowX="auto">
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="bold">
          Devices
        </Text>
      </Flex>
      <Box overflowX="auto" maxHeight="calc(100vh - 100px)">
        <Table colorScheme="gray" mb="24px">
          <Thead bg={headerBg} position="sticky" top={0} zIndex={1}>
            <Tr>
              <Th borderColor={borderColor}>No.</Th>
              <Th borderColor={borderColor} whiteSpace="nowrap">
                Product ID
              </Th>
              <Th borderColor={borderColor} whiteSpace="nowrap">
                Product Name
              </Th>
              <Th borderColor={borderColor} whiteSpace="nowrap">
                Company Name
              </Th>
              <Th borderColor={borderColor} whiteSpace="nowrap">
                Product Type
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
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default DevelopmentTable;
