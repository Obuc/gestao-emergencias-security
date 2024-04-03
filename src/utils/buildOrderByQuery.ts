interface SortInfo {
  columnKey: string;
  direction: string;
}

const buildOrderByQuery = (sortInfo: readonly SortInfo[]): string => {
  const orderByArray = sortInfo.map(({ columnKey, direction }) => {
    const sortOrder = direction === 'ASC' ? 'asc' : 'desc';
    return `${columnKey} ${sortOrder}`;
  });

  return `$orderby=${orderByArray.join(',')}`;
};

export default buildOrderByQuery;
