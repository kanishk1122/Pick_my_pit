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

// Import Redux actions
import {
  fetchAllSpecies,
  addSpecies,
  updateSpecies,
  deleteSpecies,
  toggleSpeciesStatus,
} from "../redux/slices/speciesSlice";

export default function SpeciesManager() {
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

  // DataTable templates
  const statusTemplate = (rowData) => {
    return (
      <Tag
        severity={rowData.active ? "success" : "danger"}
        value={rowData.active ? "Active" : "Inactive"}
      />
    );
  };

  const iconTemplate = (rowData) => {
    return rowData.icon ? (
      <img
        src={rowData.icon}
        alt={rowData.displayName}
        className="w-10 h-10 rounded-full object-cover"
      />
    ) : (
      <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center">
        <i className="pi pi-image text-zinc-400"></i>
      </div>
    );
  };

  const actionTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => showDialog("edit", rowData)}
      />
      <Button
        icon={rowData.active ? "pi pi-eye-slash" : "pi pi-eye"}
        rounded
        text
        severity="warning"
        onClick={() => handleToggleStatus(rowData)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() => handleDelete(rowData)}
      />
    </div>
  );

  // Dialog footer
  const dialogFooter = (
    <div>
      <Button
        label="Cancel"
        icon="pi pi-times"
        outlined
        onClick={() => setDialogVisible(false)}
      />
      <Button
        label={editMode ? "Update" : "Save"}
        icon="pi pi-check"
        onClick={handleSubmit}
        autoFocus
      />
    </div>
  );

  return (
    <div className="card">
      <Toast ref={toast} />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-zinc-100">Species Manager</h2>
        <Button
          label="Add New Species"
          icon="pi pi-plus"
          severity="success"
          onClick={() => showDialog("add")}
        />
      </div>

      <div className="card">
        {speciesStatus === "loading" ? (
          <div className="flex justify-center p-6">
            <i className="pi pi-spin pi-spinner text-3xl"></i>
          </div>
        ) : (
          <DataTable
            value={species}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            tableStyle={{ minWidth: "50rem" }}
            emptyMessage="No species found"
          >
            <Column
              field="icon"
              header="Icon"
              body={iconTemplate}
              style={{ width: "80px" }}
            />
            <Column
              field="displayName"
              header="Display Name"
              sortable
              style={{ width: "20%" }}
            />
            <Column
              field="name"
              header="System Name"
              sortable
              style={{ width: "15%" }}
            />
            <Column
              field="description"
              header="Description"
              style={{ width: "35%" }}
            />
            <Column
              field="active"
              header="Status"
              body={statusTemplate}
              sortable
              style={{ width: "10%" }}
            />
            <Column
              body={actionTemplate}
              header="Actions"
              style={{ width: "10%" }}
            />
          </DataTable>
        )}
      </div>

      <Dialog
        visible={dialogVisible}
        style={{ width: "450px" }}
        header={editMode ? "Edit Species" : "Add New Species"}
        modal
        className="p-fluid"
        footer={dialogFooter}
        onHide={() => setDialogVisible(false)}
      >
        <div className="field mt-4">
          <label htmlFor="displayName">Display Name</label>
          <InputText
            id="displayName"
            value={formData.displayName}
            onChange={(e) =>
              setFormData({ ...formData, displayName: e.target.value })
            }
            required
            className="w-full"
            placeholder="E.g. Dog, Cat, Bird"
          />
        </div>

        <div className="field mt-4">
          <label htmlFor="name">System Name</label>
          <InputText
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value.toLowerCase() })
            }
            required
            className="w-full"
            placeholder="E.g. dog, cat, bird"
          />
          <small className="text-zinc-400">
            Used for system identification (lowercase, no spaces)
          </small>
        </div>

        <div className="field mt-4">
          <label htmlFor="description">Description</label>
          <InputTextarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={3}
            className="w-full"
            placeholder="Enter species description"
          />
        </div>

        <div className="field mt-4">
          <label htmlFor="icon">Icon</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border border-zinc-300 rounded-lg overflow-hidden">
              {iconPreview ? (
                <img
                  src={iconPreview}
                  alt="Icon Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <i className="pi pi-image text-2xl"></i>
                </div>
              )}
            </div>
            <FileUpload
              mode="basic"
              name="icon"
              accept="image/*"
              maxFileSize={1000000}
              chooseLabel="Browse"
              className="p-button-outlined"
              onSelect={handleIconUpload}
              auto
            />
          </div>
          <small className="text-zinc-400">
            Upload an image (PNG, JPG, SVG). Max 1MB.
          </small>
        </div>
      </Dialog>
    </div>
  );
}
