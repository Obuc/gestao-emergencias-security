import Spinner from '../Spinner';

const DataGridLoadMore = () => {
  return (
    <div className="absolute bottom-0 right-0 h-14 w-48 flex justify-center items-center text-lg text-primary-font-font bg-primary/75">
      <Spinner />
    </div>
  );
};

export default DataGridLoadMore;
