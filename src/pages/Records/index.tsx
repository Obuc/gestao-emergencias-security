import LayoutBase from '../../layout/LayoutBase';

const Records = () => {
  return (
    <LayoutBase showMenu>
      <div className="flex flex-col w-full justify-between bg-[#F1F1F1]">
        <div className="flex flex-col p-8"></div>
        <div className="bg-white h-16 flex justify-end items-center px-10 py-5">
          {/* {!isErrorRequests && !isFetchingRequests && !isLoadingRequests && (
            <Pagination setPage={setPage} pageCount={pageCount} page={page} />
          )} */}
        </div>
      </div>

      {/* {newRequest && <LossesModal open={newRequest} onOpenChange={handleNewRequest} />} */}
    </LayoutBase>
  );
};

export default Records;
