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
  const role = localStorage.getItem('role');

  const renderTableRows = () => {
    if (loading) {
      return (
        <Tr>
          <Td colSpan="8" textAlign="center">
            <Text>Loading...</Text>
          </Td>
        </Tr>
      );
    }

    if (!tableData || tableData.length === 0) {
      return (
        <Tr>
          <Td colSpan="8" textAlign="center">
            <Text>No users found</Text>
          </Td>
        </Tr>
      );
    }

    return tableData.map((user, index) => (
      <Tr
        key={user.id}
        onClick={() => handleRowClick(user)}
        cursor="pointer"
        _hover={{ bg: rowHoverBg }}
      >
        <Td>{index + 1 + (page - 1) * 10}</Td>
        <Td
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {user.name}
        </Td>
        <Td>{user.email}</Td>
        <Td>{user.username}</Td>
        {/* <Td>{user.role}</Td> */}
        <Td whiteSpace="nowrap">{user.designation}</Td>
        <Td>{user.phoneNo}</Td>
        <Td>
          <Flex gap="2">
            <IconButton
              aria-label="Edit"
              icon={<EditIcon />}
              size="sm"
              colorScheme="blue"
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(user);
              }}
            />
            {role !== 'companyUser' && role !== 'user' && (
              <IconButton
                aria-label="Delete"
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteUser(user._id);
                }}
              />
            )}
            {/* <IconButton
              aria-label="Delete"
              icon={<DeleteIcon />}
              size="sm"
              colorScheme="red"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUser(user._id);
              }}
            /> */}
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
    <Card flexDirection="column" w="100%" px="0px">
      <Flex px="25px" mb="8px" justifyContent="space-between" align="center">
        <Text color={textColor} fontSize="22px" fontWeight="700">
          Users
        </Text>
      </Flex>
      <Box overflowX="auto" maxHeight={'calc(100vh - 100px)'}>
        <Table variant="simple" color="gray.500" mb="24px" mt="12px">
          <Thead bg={"white"} position={'sticky'} top={0}>
            <Tr>
              <Th borderColor={borderColor}>No.</Th>
              <Th borderColor={borderColor}>Name</Th>
              <Th borderColor={borderColor}>Email</Th>
              <Th borderColor={borderColor}>Username</Th>
              {/* <Th borderColor={borderColor}>Role</Th> */}
              <Th borderColor={borderColor}>Designation</Th>
              <Th borderColor={borderColor}>Phone No.</Th>
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
