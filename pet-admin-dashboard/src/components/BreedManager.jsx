"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

// Import Redux actions
import {
  fetchAllBreeds,
  addBreed,
  updateBreed,
  deleteBreed,
  toggleBreedStatus,
} from "../redux/slices/breedSlice";
import { fetchAllSpecies } from "../redux/slices/speciesSlice";

export default function BreedManager() {
  const dispatch = useDispatch();
  const breeds = useSelector((state) => state.breeds?.items) || [];
  const breedStatus = useSelector((state) => state.breeds?.status) || "idle";
  const breedError = useSelector((state) => state.breeds?.error);
  const species = useSelector((state) => state.species?.items) || [];

  // Local state
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const toast = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    description: "",
    characteristics: "",
  });

  useEffect(() => {
    dispatch(fetchAllBreeds());
    dispatch(fetchAllSpecies());
  }, [dispatch]);

  useEffect(() => {
    if (breedError && toast.current) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: breedError,
        life: 3000,
      });
    }
  }, [breedError]);

  // Form handlers
  const showDialog = (mode, breed = null) => {
    setEditMode(mode === "edit");
    if (breed) {
      setFormData({
        name: breed.name,
        species: breed.species._id || breed.species,
        description: breed.description || "",
        characteristics: Array.isArray(breed.characteristics)
          ? breed.characteristics.join(", ")
          : breed.characteristics || "",
      });
      setSelectedBreed(breed);
    } else {
      setFormData({
        name: "",
        species: "",
        description: "",
        characteristics: "",
      });
    }
    setDialogVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const breedData = {
        ...formData,
        characteristics: formData.characteristics
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item),
      };

      if (editMode) {
        await dispatch(
          updateBreed({ id: selectedBreed._id, data: breedData })
        ).unwrap();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Breed updated successfully",
        });
      } else {
        await dispatch(addBreed(breedData)).unwrap();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Breed added successfully",
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

  const handleDelete = async (breed) => {
    try {
      await dispatch(deleteBreed(breed._id)).unwrap();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Breed deleted successfully",
      });
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to delete breed",
      });
    }
  };

  const handleToggleStatus = async (breed) => {
    try {
      await dispatch(toggleBreedStatus(breed._id)).unwrap();
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: `Breed ${
          breed.active ? "deactivated" : "activated"
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

  // DataTable templates
  const statusTemplate = (rowData) => {
    return (
      <Tag
        severity={rowData.active ? "success" : "danger"}
        value={rowData.active ? "Active" : "Inactive"}
      />
    );
  };

  const characteristicsTemplate = (rowData) => {
    if (!rowData.characteristics || !rowData.characteristics.length) return "-";
    return (
      <div className="flex flex-wrap gap-1">
        {rowData.characteristics.slice(0, 3).map((char, idx) => (
          <Chip key={idx} label={char} className="text-xs" />
        ))}
        {rowData.characteristics.length > 3 && (
          <Chip
            label={`+${rowData.characteristics.length - 3}`}
            className="text-xs bg-indigo-100 text-indigo-800"
          />
        )}
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
    <div className="w-full bg-transparent">
      <Toast ref={toast} />

      <div className=" flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-zinc-100">Breed Manager</h2>
        <Button
          label="Add New Breed"
          icon="pi pi-plus"
          severity="success"
          className="p-button-outlined p-2"
          onClick={() => showDialog("add")}
        />
      </div>

      <div className="card">
        {breedStatus === "loading" ? (
          <div className="flex justify-center p-6">
            <i className="pi pi-spin pi-spinner text-3xl"></i>
          </div>
        ) : (
          <DataTable
            value={breeds}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            tableStyle={{ minWidth: "50rem" }}
            emptyMessage="No breeds found"
          >
            <Column
              field="name"
              header="Breed Name"
              sortable
              style={{ width: "20%" }}
            />
            <Column
              field="species.displayName"
              header="Species"
              sortable
              style={{ width: "15%" }}
            />
            <Column
              field="description"
              header="Description"
              style={{ width: "25%" }}
            />
            <Column
              field="characteristics"
              header="Traits"
              body={characteristicsTemplate}
              style={{ width: "20%" }}
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
        header={editMode ? "Edit Breed" : "Add New Breed"}
        modal
        className="p-fluid"
        footer={dialogFooter}
        onHide={() => setDialogVisible(false)}
      >
        <div className="field mt-4">
          <label htmlFor="name">Name</label>
          <InputText
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full p-2"
            placeholder="Enter breed name"
          />
        </div>

        <div className="field mt-4">
          <label htmlFor="species">Species</label>
          <Dropdown
            id="species"
            value={formData.species}
            onChange={(e) => setFormData({ ...formData, species: e.value })}
            options={species}
            optionLabel="displayName"
            optionValue="_id"
            placeholder="Select Species"
            required
            className="w-full "
          />
        </div>

        <div className="field mt-4">
          <label htmlFor="description">Description</label>
          <InputText
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2"
            placeholder="Enter description"
          />
        </div>

        <div className="field mt-4">
          <label htmlFor="characteristics">
            Characteristics (comma separated)
          </label>
          <InputText
            id="characteristics"
            value={formData.characteristics}
            onChange={(e) =>
              setFormData({ ...formData, characteristics: e.target.value })
            }
            className="w-full p-2"
            placeholder="E.g. Friendly, Loyal, Energetic"
          />
          <small className="text-zinc-400">
            Enter characteristics separated by commas
          </small>
        </div>
      </Dialog>
    </div>
  );
}
