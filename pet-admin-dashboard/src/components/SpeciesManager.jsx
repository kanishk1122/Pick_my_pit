"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";

// Import Redux actions
import {
  fetchAllSpecies,
  addSpecies,
  updateSpecies,
  deleteSpecies,
  toggleSpeciesStatus,
} from "../redux/slices/speciesSlice";

export default function SpeciesManager() {
  const { user, isAuthenticated, loading } = useAuth();
  const dispatch = useDispatch();
  const species = useSelector((state) => state.species?.items) || [];
  const speciesStatus = useSelector((state) => state.species?.status) || "idle";
  const speciesError = useSelector((state) => state.species?.error);

  // Local state
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const toast = useRef(null);
  const [iconPreview, setIconPreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    icon: "",
  });

  useEffect(() => {
    dispatch(fetchAllSpecies());
  }, [dispatch]);

  useEffect(() => {
    if (speciesError && toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: speciesError,
        life: 3000,
      });
    }
  }, [speciesError]);

  // Form handlers
  const showDialog = (mode, species = null) => {
    setEditMode(mode === "edit");
    if (species) {
      setFormData({
        name: species.name,
        displayName: species.displayName,
        description: species.description || "",
        icon: species.icon || "",
      });
      setIconPreview(species.icon || null);
      setSelectedSpecies(species);
    } else {
      setFormData({
        name: "",
        displayName: "",
        description: "",
        icon: "",
      });
      setIconPreview(null);
    }
    setDialogVisible(true);
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await dispatch(
          updateSpecies({ id: selectedSpecies._id, data: formData })
        ).unwrap();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Species updated successfully",
        });
      } else {
        await dispatch(addSpecies(formData)).unwrap();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Species added successfully",
        });
      }
      setDialogVisible(false);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "An error occurred",
      });
    }
  };

  const handleDelete = async (species) => {
    try {
      await dispatch(deleteSpecies(species._id)).unwrap();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Species deleted successfully",
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to delete species",
      });
    }
  };

  const handleToggleStatus = async (species) => {
    try {
      await dispatch(toggleSpeciesStatus(species._id)).unwrap();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Species ${
          species.active ? "deactivated" : "activated"
        } successfully`,
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to update status",
      });
    }
  };

  const handleIconUpload = (e) => {
    const file = e.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setFormData({ ...formData, icon: base64Data });
        setIconPreview(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmDelete = (species) => {
    confirmDialog({
      message: `Are you sure you want to delete "${species.displayName}"? This action cannot be undone.`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => handleDelete(species),
      reject: () => {},
    });
  };

  // DataTable templates with modern dark theme styling
  const statusTemplate = (rowData) => {
    return (
      <div className="flex items-center justify-center">
        <Tag
          severity={rowData.active ? "success" : "danger"}
          value={rowData.active ? "Active" : "Inactive"}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
            rowData.active
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        />
      </div>
    );
  };

  const iconTemplate = (rowData) => {
    return (
      <div className="flex items-center justify-center">
        {rowData.icon ? (
          <div className="relative group">
            <img
              src={rowData.icon}
              alt={rowData.displayName}
              className="w-12 h-12 rounded-xl object-cover border-2 border-zinc-700 shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:border-indigo-500/50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-200"></div>
          </div>
        ) : (
          <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-zinc-700 rounded-xl flex items-center justify-center border-2 border-zinc-600 shadow-lg">
            <i className="pi pi-image text-zinc-400 text-lg"></i>
          </div>
        )}
      </div>
    );
  };

  const nameTemplate = (rowData) => {
    return (
      <div className="space-y-2">
        <div className="font-semibold text-zinc-100 text-base">
          {rowData.displayName}
        </div>
        <div className="text-xs text-zinc-400 font-mono bg-zinc-800/50 px-2 py-1 rounded-md inline-block border border-zinc-700/50">
          {rowData.name}
        </div>
      </div>
    );
  };

  const descriptionTemplate = (rowData) => {
    const description = rowData.description || "No description available";
    const truncated =
      description.length > 80
        ? description.substring(0, 80) + "..."
        : description;

    return (
      <div
        className="text-zinc-300 leading-relaxed text-sm"
        title={description}
      >
        {truncated}
      </div>
    );
  };

  const actionTemplate = (rowData) => (
    <div className="flex items-center justify-center gap-1">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        size="small"
        className="w-9 h-9 hover:bg-blue-500/10 hover:text-blue-400 text-zinc-400 transition-all duration-200"
        onClick={() => showDialog("edit", rowData)}
        tooltip="Edit Species"
        tooltipOptions={{ position: "top" }}
      />
      <Button
        icon={rowData.active ? "pi pi-eye-slash" : "pi pi-eye"}
        rounded
        text
        size="small"
        className="w-9 h-9 hover:bg-amber-500/10 hover:text-amber-400 text-zinc-400 transition-all duration-200"
        onClick={() => handleToggleStatus(rowData)}
        tooltip={rowData.active ? "Deactivate" : "Activate"}
        tooltipOptions={{ position: "top" }}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        size="small"
        className="w-9 h-9 hover:bg-red-500/10 hover:text-red-400 text-zinc-400 transition-all duration-200"
        onClick={() => confirmDelete(rowData)}
        tooltip="Delete Species"
        tooltipOptions={{ position: "top" }}
      />
    </div>
  );

  // Enhanced dialog footer with dark theme
  const dialogFooter = (
    <div className="flex justify-end gap-3 pt-6 border-t border-zinc-700/50">
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        className="px-6 py-2 border-zinc-600 text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-500 transition-all duration-200"
        onClick={() => setDialogVisible(false)}
      />
      <Button
        label={editMode ? "Update Species" : "Create Species"}
        icon="pi pi-check"
        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all duration-200"
        onClick={handleSubmit}
        autoFocus
      />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-zinc-950">
      <div className="w-full">
        <main className="w-full">
          <div className="w-full space-y-8 p-6">
            <Toast ref={toast} position="bottom-right" />
            <ConfirmDialog />

            {/* Header Section - Reduced Height */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 w-full py-4">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Species Management
                </h1>
                <p className="text-zinc-400 text-lg">
                  Manage animal species in your system
                </p>
              </div>
              <Button
                label="Add New Species"
                icon="pi pi-plus"
                className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-lg shadow-lg transition-all duration-200 border-0"
                onClick={() => showDialog("add")}
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Total Species</p>
                    <p className="text-3xl font-bold text-zinc-100">
                      {species.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                    <i className="pi pi-list text-indigo-400 text-xl"></i>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Active Species</p>
                    <p className="text-3xl font-bold text-emerald-400">
                      {species.filter((s) => s.active).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                    <i className="pi pi-check-circle text-emerald-400 text-xl"></i>
                  </div>
                </div>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-xl backdrop-blur-sm hover:bg-zinc-800/30 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-zinc-400">Inactive Species</p>
                    <p className="text-3xl font-bold text-red-400">
                      {species.filter((s) => !s.active).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                    <i className="pi pi-times-circle text-red-400 text-xl"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table - Full Width */}
            <div className="w-full overflow-x-auto">
              {speciesStatus === "loading" ? (
                <div className="flex justify-center items-center p-12">
                  <div className="flex flex-col items-center gap-3">
                    <i className="pi pi-spin pi-spinner text-3xl text-indigo-400"></i>
                    <p className="text-zinc-400">Loading species...</p>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <DataTable
                    value={species}
                    paginator={species.length > 0}
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    tableStyle={{ width: "100%" }}
                    style={{ width: "100%" }}
                    emptyMessage={
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <i className="pi pi-inbox text-6xl text-zinc-600"></i>
                        <h3 className="text-xl font-semibold text-zinc-300">
                          No Species Found
                        </h3>
                        <p className="text-zinc-500 text-center max-w-md">
                          There are no species in the system yet. Click "Add New
                          Species" to get started.
                        </p>
                      </div>
                    }
                    className="species-datatable-theme"
                    stripedRows
                    showGridlines={false}
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} species"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    responsiveLayout="scroll"
                  >
                    <Column
                      field="icon"
                      header={
                        <div className="flex items-center justify-center gap-2">
                          <i className="pi pi-image text-indigo-400"></i>
                          <span>Icon</span>
                        </div>
                      }
                      body={iconTemplate}
                      style={{ width: "100px" }}
                      headerStyle={{ textAlign: "center" }}
                      bodyStyle={{
                        textAlign: "center",
                        padding: "1.5rem 1rem",
                      }}
                    />
                    <Column
                      field="displayName"
                      header={
                        <div className="flex items-center gap-2">
                          <i className="pi pi-tag text-emerald-400"></i>
                          <span>Species Details</span>
                        </div>
                      }
                      body={nameTemplate}
                      sortable
                      style={{ width: "25%" }}
                      bodyStyle={{ padding: "1.5rem 1rem" }}
                    />
                    <Column
                      field="description"
                      header={
                        <div className="flex items-center gap-2">
                          <i className="pi pi-align-left text-blue-400"></i>
                          <span>Description</span>
                        </div>
                      }
                      body={descriptionTemplate}
                      style={{ width: "40%" }}
                      bodyStyle={{ padding: "1.5rem 1rem" }}
                    />
                    <Column
                      field="active"
                      header={
                        <div className="flex items-center justify-center gap-2">
                          <i className="pi pi-circle text-amber-400"></i>
                          <span>Status</span>
                        </div>
                      }
                      body={statusTemplate}
                      sortable
                      style={{ width: "15%" }}
                      headerStyle={{ textAlign: "center" }}
                      bodyStyle={{
                        textAlign: "center",
                        padding: "1.5rem 1rem",
                      }}
                    />
                    <Column
                      body={actionTemplate}
                      header={
                        <div className="flex items-center justify-center gap-2">
                          <i className="pi pi-cog text-purple-400"></i>
                          <span>Actions</span>
                        </div>
                      }
                      style={{ width: "15%" }}
                      headerStyle={{ textAlign: "center" }}
                      bodyStyle={{
                        textAlign: "center",
                        padding: "1.5rem 1rem",
                      }}
                    />
                  </DataTable>
                </div>
              )}
            </div>

            {/* Enhanced Dialog */}
            <Dialog
              visible={dialogVisible}
              style={{ width: "550px" }}
              header={
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                    <i
                      className={`pi ${
                        editMode ? "pi-pencil" : "pi-plus"
                      } text-indigo-400`}
                    ></i>
                  </div>
                  <span className="text-xl font-semibold text-zinc-100">
                    {editMode ? "Edit Species" : "Add New Species"}
                  </span>
                </div>
              }
              modal
              className="species-dialog-dark"
              footer={dialogFooter}
              onHide={() => setDialogVisible(false)}
            >
              <div className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label
                      htmlFor="displayName"
                      className="block text-sm font-semibold text-zinc-200"
                    >
                      Display Name <span className="text-red-400">*</span>
                    </label>
                    <InputText
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          displayName: e.target.value,
                        })
                      }
                      required
                      className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="E.g. Dog, Cat, Bird"
                    />
                  </div>

                  <div className="space-y-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-zinc-200"
                    >
                      System Name <span className="text-red-400">*</span>
                    </label>
                    <InputText
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value.toLowerCase(),
                        })
                      }
                      required
                      className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono transition-all duration-200"
                      placeholder="E.g. dog, cat, bird"
                    />
                    <p className="text-xs text-zinc-500">
                      Used for system identification (lowercase, no spaces)
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label
                    htmlFor="description"
                    className="block text-sm font-semibold text-zinc-200"
                  >
                    Description
                  </label>
                  <InputTextarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full p-3 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all duration-200"
                    placeholder="Enter a brief description of this species..."
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-zinc-200">
                    Species Icon
                  </label>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 border-2 border-dashed border-zinc-600 rounded-xl overflow-hidden bg-zinc-800/30">
                        {iconPreview ? (
                          <img
                            src={iconPreview}
                            alt="Icon Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <i className="pi pi-image text-zinc-500 text-2xl"></i>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <FileUpload
                        mode="basic"
                        name="icon"
                        accept="image/*"
                        maxFileSize={1000000}
                        chooseLabel="Choose Image"
                        className="species-file-upload"
                        onSelect={handleIconUpload}
                        auto
                      />
                      <p className="text-xs text-zinc-500">
                        Upload an image (PNG, JPG, SVG). Maximum file size: 1MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .species-datatable-theme {
          width: 100% !important;
          background: transparent !important;
          border: none !important;
        }

        .species-datatable-theme .p-datatable {
          width: 100% !important;
          background: transparent !important;
          box-shadow: none !important;
        }

        .species-datatable-theme .p-datatable-table {
          width: 100% !important;
          background: transparent !important;
          table-layout: fixed !important;
          border: none !important;
        }

        .species-datatable-theme .p-datatable-wrapper {
          width: 100% !important;
          background: transparent !important;
          border: none !important;
          border-radius: 0 !important;
          overflow-x: auto !important;
          box-shadow: none !important;
        }

        .species-datatable-theme .p-datatable-thead {
          width: 100% !important;
        }

        .species-datatable-theme .p-datatable-tbody {
          width: 100% !important;
        }

        .species-datatable-theme .p-datatable-thead > tr {
          width: 100% !important;
        }

        .species-datatable-theme .p-datatable-tbody > tr {
          width: 100% !important;
        }

        .species-datatable-theme .p-datatable-thead > tr > th {
          background: rgba(24, 24, 27, 0.8) !important;
          color: #e4e4e7 !important;
          border: none !important;
          border-bottom: 1px solid rgba(63, 63, 70, 0.2) !important;
          padding: 1.25rem 1rem !important;
          font-weight: 700 !important;
          font-size: 0.875rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          backdrop-filter: blur(10px) !important;
          box-shadow: none !important;
          white-space: nowrap !important;
        }

        .species-datatable-theme .p-datatable-thead > tr > th:first-child {
          border-top-left-radius: 12px !important;
          width: 100px !important;
        }

        .species-datatable-theme .p-datatable-thead > tr > th:last-child {
          border-top-right-radius: 12px !important;
          width: 15% !important;
        }

        .species-datatable-theme .p-datatable-tbody > tr > td {
          border: none !important;
          border-bottom: 1px solid rgba(63, 63, 70, 0.1) !important;
          background: transparent !important;
          color: #e4e4e7 !important;
          transition: all 0.2s ease !important;
          padding: 1.25rem 1rem !important;
        }

        .species-datatable-theme .p-datatable-tbody > tr:nth-child(even) {
          background: rgba(24, 24, 27, 0.1) !important;
        }

        .species-datatable-theme .p-datatable-tbody > tr:hover {
          background: rgba(39, 39, 42, 0.3) !important;
          backdrop-filter: blur(10px) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }

        .species-datatable-theme .p-datatable-tbody > tr:hover > td {
          border-color: rgba(99, 102, 241, 0.2) !important;
        }

        .species-datatable-theme .p-paginator {
          width: 100% !important;
          background: rgba(24, 24, 27, 0.6) !important;
          border: none !important;
          border-top: 1px solid rgba(63, 63, 70, 0.2) !important;
          color: #e4e4e7 !important;
          padding: 1rem !important;
          backdrop-filter: blur(10px) !important;
          border-bottom-left-radius: 12px !important;
          border-bottom-right-radius: 12px !important;
        }

        .species-datatable-theme .p-paginator .p-paginator-element {
          color: #a1a1aa !important;
          transition: all 0.2s ease !important;
          border-radius: 6px !important;
          font-weight: 500 !important;
        }

        .species-datatable-theme .p-paginator .p-paginator-element:hover {
          background: rgba(99, 102, 241, 0.1) !important;
          color: #c7d2fe !important;
          transform: translateY(-1px) !important;
        }

        .species-datatable-theme .p-paginator .p-paginator-element.p-highlight {
          background: rgba(99, 102, 241, 0.2) !important;
          color: #e0e7ff !important;
          border: 1px solid rgba(99, 102, 241, 0.3) !important;
        }

        .species-datatable-theme .p-dropdown {
          background: rgba(39, 39, 42, 0.5) !important;
          border: 1px solid rgba(99, 102, 241, 0.2) !important;
          color: #e4e4e7 !important;
          border-radius: 6px !important;
        }

        .species-datatable-theme .p-dropdown:hover {
          border-color: rgba(99, 102, 241, 0.4) !important;
        }

        .species-datatable-theme .p-sortable-column {
          transition: all 0.2s ease !important;
        }

        .species-datatable-theme .p-sortable-column:hover {
          background: rgba(99, 102, 241, 0.05) !important;
        }

        .species-datatable-theme .p-sortable-column-icon {
          color: rgba(99, 102, 241, 0.7) !important;
          margin-left: 0.5rem !important;
        }

        .species-datatable-theme .p-column-header-content {
          font-family: "Inter", system-ui, sans-serif !important;
          font-weight: 700 !important;
        }

        /* Remove borders from wrapper */
        .species-datatable-theme .p-datatable-wrapper {
          width: 100% !important;
          background: transparent !important;
          border: none !important;
          border-radius: 0 !important;
          overflow-x: auto !important;
          box-shadow: none !important;
        }

        .species-datatable-theme .p-datatable {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
        }

        /* Enhanced dialog styles */
        .species-dialog-dark .p-dialog {
          background: #18181b !important;
          border: 1px solid rgba(63, 63, 70, 0.5) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }

        .species-dialog-dark .p-dialog-header {
          background: rgba(24, 24, 27, 0.95) !important;
          border-bottom: 1px solid rgba(63, 63, 70, 0.5) !important;
          padding: 1.5rem !important;
          backdrop-filter: blur(10px) !important;
        }

        .species-dialog-dark .p-dialog-content {
          background: #18181b !important;
          color: #e4e4e7 !important;
          padding: 0 1.5rem 1.5rem !important;
        }

        .species-file-upload .p-button {
          background: rgba(99, 102, 241, 0.1) !important;
          border: 1px solid rgba(99, 102, 241, 0.3) !important;
          color: #a5b4fc !important;
          padding: 0.75rem 1.5rem !important;
          border-radius: 0.5rem !important;
          transition: all 0.2s ease !important;
        }

        .species-file-upload .p-button:hover {
          background: rgba(99, 102, 241, 0.2) !important;
          border-color: rgba(99, 102, 241, 0.5) !important;
          color: #c7d2fe !important;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .species-datatable-theme .p-datatable-thead > tr > th {
            padding: 1rem 0.5rem !important;
            font-size: 0.75rem !important;
          }

          .species-datatable-theme .p-datatable-tbody > tr > td {
            padding: 1rem 0.5rem !important;
          }
        }

        /* Enhanced empty message styling */
        .species-datatable-theme .p-datatable-emptymessage > td {
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
        }

        .species-datatable-theme .p-datatable-tbody-empty {
          background: transparent !important;
        }

        /* Hide paginator when no data */
        .species-datatable-theme:has(.p-datatable-emptymessage) .p-paginator {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
