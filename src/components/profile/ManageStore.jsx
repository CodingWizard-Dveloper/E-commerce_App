import React from "react";

const ManageStore = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition w-fit cursor-pointer"
          onClick={() => {
            if (
              window.confirm(
                "Do you want to delete your store this action is reversible? "
              )
            ) {
              dispatch(
                deleteStore({
                  storeId: defaultUser?.store?._id,
                  callBack: () => dispatch(checkAuth()),
                })
              );
            }
          }}
        >
          <Trash2 className="h-5 w-5" /> Delete Your store
        </button>
      </div>
    </>
  );
};

export default ManageStore;
