import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ListForm from './components/ListForm';
import ListItem from './components/ListItem';
import LoadingSpinner from './components/LoadingSpinner';
import { showSuccessToast, showErrorToast } from './utils/toast';
import { fetchLists, createList, updateList, deleteList } from './services/api';
import { APP_NAME } from './constants';

function App() {
  const [lists, setLists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllLists();
  }, []);

  const fetchAllLists = async () => {
    try {
      setIsLoading(true);
      const fetchedLists = await fetchLists();
      setLists(fetchedLists);
      setIsLoading(false);
    } catch (error) {
      console.error('Error in fetchAllLists:', error);
      setError('Failed to fetch lists. Please try again later.');
      setIsLoading(false);
      showErrorToast('Failed to fetch lists. Please try again later.');
    }
  };

  const handleCreateList = async (newList) => {
    try {
      setIsLoading(true);
      const createdList = await createList(newList);
      setLists([...lists, createdList]);
      setIsLoading(false);
      showSuccessToast('List created successfully!');
    } catch (error) {
      console.error('Error creating list:', error);
      setIsLoading(false);
      showErrorToast('Failed to create list. Please try again.');
    }
  };

  const handleUpdateList = async (id, updatedList) => {
    try {
      const updated = await updateList(id, updatedList);
      setLists(lists.map(list => list._id === id ? updated : list));
      showSuccessToast('List updated successfully!');
    } catch (error) {
      console.error('Error updating list:', error);
      showErrorToast('Failed to update list. Please try again.');
    }
  };

  const handleDeleteList = async (id) => {
    try {
      setIsLoading(true);
      await deleteList(id);
      setLists(lists.filter(list => list._id !== id));
      setIsLoading(false);
      showSuccessToast('List deleted successfully!');
    } catch (error) {
      console.error('Error deleting list:', error);
      setIsLoading(false);
      showErrorToast('Failed to delete list. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <ToastContainer />
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-800">{APP_NAME}</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create a New List</h2>
          <ListForm onSubmit={handleCreateList} />

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Your Lists</h2>
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : lists.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {lists.map((list) => (
                <ListItem
                  key={list._id}
                  list={list}
                  onUpdate={handleUpdateList}
                  onDelete={handleDeleteList}
                />
              ))}
            </div>
          ) : (
            <p>No lists found. Create one to get started!</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;