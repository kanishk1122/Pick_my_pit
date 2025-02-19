import React from 'react';

const AddressItem = ({ address, onClick, accessmode, isSelected, onEdit, onDelete }) => {
  return (
    <div
      className={`relative bg-white p-6 min-h-[230px] rounded-2xl border-2 ${
        isSelected ? 'border-green-500' : 'border-gray-200'
      } hover:border-green-500 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer max-sm:w-full group overflow-hidden`}
      onClick={onClick}
    >
      {/* Hover Actions */}
      {accessmode == 'edit' && (
        <div className="absolute right-0 top-0 flex gap-2 p-2 transition-transform duration-300 transform group-hover:translate-y-0 -translate-y-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            className="p-2 bg-green-50 hover:bg-green-100 rounded-full text-green-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address);
            }}
            className="p-2 bg-red-50 hover:bg-red-100 rounded-full text-red-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Default Badge */}
      {address.isDefault && (
        <div className="absolute left-0 top-0 bg-green-500 text-white px-3 py-1 rounded-br-lg text-sm font-medium">
          Default
        </div>
      )}

      {/* Address Content */}
      <div className={`${address.isDefault ? "mt-8" : "mt-2"} space-y-2`}>
        <h3 className="font-semibold text-lg text-gray-800">{address.street}</h3>
        {address.landmark && (
          <p className="text-gray-600 text-sm flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {address.landmark}
          </p>
        )}
        <div className="text-sm text-gray-600 space-y-1">
          <p>{address.city}, {address.state}</p>
          <p>{address.postalCode}</p>
          <p>{address.country}</p>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute inset-0 bg-green-50 opacity-20 pointer-events-none rounded-2xl"></div>
      )}
    </div>
  );
};

export default AddressItem;
