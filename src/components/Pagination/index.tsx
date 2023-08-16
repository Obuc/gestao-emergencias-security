import { Pagination as PaginationMUI, PaginationProps, styled } from '@mui/material';

interface IPaginationProps extends PaginationProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  pageCount: number;
}

const StyledPagination = styled(PaginationMUI)(() => ({
  '& .MuiPaginationItem-root': {
    borderRadius: '0',
    margin: '.125rem',
    fontFamily: 'Montserrat',
    color: '#00354F',
    '&.Mui-selected': {
      backgroundColor: '#00354F',
      fontWeight: '500',
      color: '#FFF',
    },
    '&:hover': {
      backgroundColor: '#00354F',
      boxShadow: '0px 4px 10px 0px rgba(0, 0, 0, 0.3)',
      color: '#FFF',
    },
  },
}));

const Pagination = ({ setPage, page, pageCount, ...props }: IPaginationProps) => {
  return <StyledPagination {...props} onChange={(_, page) => setPage(page)} count={pageCount} page={page} />;
};

export default Pagination;
