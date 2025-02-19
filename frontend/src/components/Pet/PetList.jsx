import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { POST } from '../../Consts/apikeys';
import FilterSidebar from './FilterSidebar';
import FilteredPetList from './FilteredPetList';
import Pagination from './Pagination';

const PetList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0
  });
  const location = useLocation();
  const navigate = useNavigate();

  const fetchPets = useCallback(async (params, cancelToken) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching pets with params:', params.toString());
      
      const response = await axios.get(POST.Filter, {
        params,
        cancelToken
      });

      console.log('API Response:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch pets');
      }

      setPets(response.data.posts || []);
      setPageInfo({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalPosts: response.data.totalPosts
      });
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error fetching pets:', error);
        console.error('Error details:', error.response?.data || error.message);
        setError(`Failed to fetch pets. Please try again. ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const queryParams = new URLSearchParams(location.search);
    
    if (!queryParams.has('page')) {
      queryParams.set('page', '1');
    }

    fetchPets(queryParams, source.token);

    return () => {
      source.cancel('Request canceled due to component unmount or new request');
    };
  }, [location.search, fetchPets]);

  const handleFilterChange = useCallback((newFilters) => {
    const queryParams = new URLSearchParams({
      ...newFilters,
      page: '1'
    });
    navigate(`${location.pathname}?${queryParams.toString()}`);
  }, [navigate, location.pathname]);

  const handlePageChange = useCallback((newPage) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set('page', newPage.toString());
    navigate(`${location.pathname}?${queryParams.toString()}`);
  }, [navigate, location.search, location.pathname]);

  return (
    <div className="flex bg-white rounded-t-2xl border-t-4 border-black min-h-screen overflow-hidden">
      <FilterSidebar 
        onFilterChange={handleFilterChange} 
        initialFilters={Object.fromEntries(new URLSearchParams(location.search))} 
      />
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-600">Find Your Perfect Pet</h1>
        
        {error && (
          <div className="text-red-600 text-center mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {pets.length === 0 ? (
              <div className="text-center text-gray-600 text-xl">
                No pets found matching your criteria
              </div>
            ) : (
              <>
                <FilteredPetList 
                  pets={pets} 
                  pageInfo={pageInfo} 
                  onPageChange={handlePageChange}
                />
                <div className="text-center text-gray-600 mt-4">
                  Showing {pets.length} of {pageInfo.totalPosts} pets
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(PetList);