'use client';

import { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import * as XLSX from 'xlsx';

const species = [
  { name: 'Dog', code: 'dog' },
  { name: 'Cat', code: 'cat' },
  { name: 'Bird', code: 'bird' },
  { name: 'Fish', code: 'fish' },
  { name: 'Small Pet', code: 'small_pet' },
];

export default function BreedManager() {
  const [breeds, setBreeds] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const toast = useRef(null);
  const [apiMessage, setApiMessage] = useState('');
  const [bulkUploadVisible, setBulkUploadVisible] = useState(false);
  const fileUploadRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    species: null,
    description: '',
    characteristics: '',
    status: 'active'
  });

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      const response = await fetch('/api/breeds');
      if (!response.ok) throw new Error('Failed to fetch breeds');
      const data = await response.json();
      setBreeds(data);
    } catch (error) {
      console.error('Error fetching breeds:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to fetch breeds',
        life: 3000
      });
    }
  };

  const showDialog = (mode, breed = null) => {
    setEditMode(mode === 'edit');
    if (breed) {
      setFormData({
        name: breed.name,
        species: species.find(s => s.code === breed.species),
        description: breed.description,
        characteristics: breed.characteristics,
        status: breed.status
      });
      setSelectedBreed(breed);
    } else {
      setFormData({
        name: '',
        species: null,
        description: '',
        characteristics: '',
        status: 'active'
      });
    }
    setDialogVisible(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.species) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
        life: 3000
      });
      return;
    }

    try {
      const url = editMode ? `/api/breeds/${selectedBreed._id}` : '/api/breeds';
      const method = editMode ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          species: formData.species.code,
          description: formData.description,
          characteristics: formData.characteristics,
          status: formData.status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save breed');
      }
      
      await fetchBreeds();
      setDialogVisible(false);
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: `Breed ${editMode ? 'updated' : 'added'} successfully`,
        life: 3000
      });
    } catch (error) {
      console.error('Error saving breed:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000
      });
    }
  };

  const handleDelete = async (breed) => {
    try {
      const response = await fetch(`/api/breeds/${breed._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete breed');

      await fetchBreeds();
      toast.current.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Breed deleted successfully',
        life: 3000
      });
    } catch (error) {
      console.error('Error deleting breed:', error);
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete breed',
        life: 3000
      });
    }
  };

  const handleStatusChange = (breed) => {
    const newStatus = breed.status === 'active' ? 'banned' : 'active';
    setBreeds(breeds.map(b => b.id === breed.id ? { ...b, status: newStatus } : b));
    toast.current.show({
      severity: 'info',
      summary: 'Status Updated',
      detail: `Breed ${newStatus === 'banned' ? 'banned' : 'activated'} successfully`,
      life: 3000
    });
  };

  const handleBulkUpload = async (event) => {
    const formData = new FormData();
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        try {
          const response = await fetch('/api/breeds/bulk-upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
          });

          if (!response.ok) {
            throw new Error('Failed to upload breeds');
          }

          const result = await response.json();
          toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: `${result.count} breeds uploaded successfully`,
            life: 3000
          });
          await fetchBreeds();
          setBulkUploadVisible(false);
        } catch (error) {
          console.error('Error uploading breeds:', error);
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
            life: 3000
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const statusBodyTemplate = (rowData) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'active':
          return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
        case 'banned':
          return 'bg-red-500/10 text-red-400 border-red-500/20';
        default:
          return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      }
    };

    return (
      <span className={`px-3 py-1 text-xs rounded-full font-medium border ${getStatusColor(rowData.status)}`}>
        {rowData.status.charAt(0).toUpperCase() + rowData.status.slice(1)}
      </span>
    );
  };

  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <button className="p-2 text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-800"
        onClick={() => showDialog('edit', rowData)}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button 
        className="p-2 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
        onClick={() => handleDelete(rowData)}>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <Toast ref={toast} position="bottom-right" />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-zinc-100">Breed Manager</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setBulkUploadVisible(true)}
            className="px-4 py-2 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 hover:border-zinc-600 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <i className="pi pi-upload" />
            Bulk Upload
          </button>
          <button 
            onClick={() => showDialog('add')}
            className="px-4 py-2 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 hover:border-zinc-600 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
            </svg>
            Add New Breed
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden">
        <DataTable
          value={breeds}
          paginator
          rows={10}
          className="breed-table-dark"
          emptyMessage="No breeds found"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} breeds"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        >
          <Column field="index" header="Index" sortable />
          <Column field="name" header="Breed Name" sortable />
          <Column field="species" header="Species" sortable />
          <Column field="description" header="Description" />
          <Column field="characteristics" header="Characteristics" />
          <Column field="status" header="Status" body={statusBodyTemplate} sortable />
          <Column body={actionBodyTemplate} header="Actions" style={{ width: '10rem' }} />
        </DataTable>
      </div>

      <Dialog
        visible={bulkUploadVisible}
        onHide={() => setBulkUploadVisible(false)}
        header="Bulk Upload Breeds"
        modal
        className="breed-dialog-dark"
        style={{ width: '50vw' }}
      >
        <div className="p-fluid">
          <FileUpload
            ref={fileUploadRef}
            name="file"
            url="/api/breeds/bulk-upload"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            maxFileSize={1000000}
            emptyTemplate={<p className="m-0">Drag and drop an Excel file here or click to upload.</p>}
            chooseLabel="Select Excel File"
            uploadLabel="Upload"
            cancelLabel="Cancel"
            customUpload
            uploadHandler={handleBulkUpload}
          />
          {/* You can add a textarea or input here for list data if needed */}
        </div>
      </Dialog>

      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        header={`${editMode ? 'Edit' : 'Add'} Breed`}
        headerClassName="bg-zinc-900 text-zinc-100 border-b border-zinc-800"
        closeIcon={<>
            <span className="text-white border-2 bg-zinc-200/10 duration-200  hover:border-red-500 px-2 py-1 rounded-lg hover:bg-red-700 mr-1">Close</span>
            <i className="pi pi-times text-red-500 hover:text-red-300 transition-colors duration-200" />
        </>}
        modal
        className=" overflow-hidden"
        style={{ width: '650px' }}
      >
        <div className="p-6 space-y-6 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="field required">
              <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-2">
                Breed Name
              </label>
              <InputText
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Enter breed name"
              />
            </div>

            <div className="field required">
              <label htmlFor="species" className="block text-sm font-medium text-zinc-400 mb-2">
                Species
              </label>
              <Dropdown
                id="species"
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.value })}
                options={species}
                optionLabel="name"
                placeholder="Select Species"
                className=" w-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div className="field col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-zinc-400 mb-2">
                Description
              </label>
              <InputText
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Enter breed description"
              />
            </div>

            <div className="field col-span-2">
              <label htmlFor="characteristics" className="block text-sm font-medium text-zinc-400 mb-2">
                Characteristics
              </label>
              <InputText
                id="characteristics"
                value={formData.characteristics}
                onChange={(e) => setFormData({ ...formData, characteristics: e.target.value })}
                className="w-full bg-zinc-800/50 border border-zinc-700/50 text-zinc-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Enter breed characteristics"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
            <button
              onClick={() => setDialogVisible(false)}
              className="px-4 py-2 text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 hover:border-zinc-600 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-zinc-100 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-200"
            >
              Save
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
