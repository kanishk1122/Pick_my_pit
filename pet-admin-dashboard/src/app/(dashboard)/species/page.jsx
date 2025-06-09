"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSpecies,
  toggleSpeciesStatus,
  deleteSpecies,
} from "@/redux/slices/speciesSlice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

export default function SpeciesPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.species);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAllSpecies());
  }, [dispatch]);

  const handleStatusToggle = (id) => {
    dispatch(toggleSpeciesStatus(id));
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete this species?",
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => dispatch(deleteSpecies(id)),
    });
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        severity={rowData.active ? "success" : "danger"}
        value={rowData.active ? "Active" : "Inactive"}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-sm"
          onClick={() => {
            setSelectedSpecies(rowData);
            setIsEditDialogOpen(true);
          }}
        />
        <Button
          icon={rowData.active ? "pi pi-times" : "pi pi-check"}
          className={`p-button-rounded p-button-sm ${
            rowData.active ? "p-button-warning" : "p-button-success"
          }`}
          onClick={() => handleStatusToggle(rowData._id)}
          tooltip={rowData.active ? "Deactivate" : "Activate"}
          tooltipOptions={{ position: "top" }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-sm"
          onClick={() => confirmDelete(rowData._id)}
        />
      </div>
    );
  };

  if (status === "loading") {
    return <div className="text-white">Loading species...</div>;
  }

  if (status === "failed") {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">Species Management</h1>
        <Button
          label="Add New Species"
          icon="pi pi-plus"
          onClick={() => setIsAddDialogOpen(true)}
        />
      </div>

      <DataTable
        value={items}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        tableStyle={{ minWidth: "50rem" }}
        selection={selectedSpecies}
        onSelectionChange={(e) => setSelectedSpecies(e.value)}
        dataKey="_id"
        className="bg-zinc-800/50"
      >
        <Column field="name" header="Name" sortable />
        <Column field="description" header="Description" />
        <Column field="status" header="Status" body={statusBodyTemplate} />
        <Column header="Actions" body={actionBodyTemplate} />
      </DataTable>

      <ConfirmDialog />

      {/* Add/Edit modals would go here */}
    </div>
  );
}
