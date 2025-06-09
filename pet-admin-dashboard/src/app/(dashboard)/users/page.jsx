"use client";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch users from your API
    // For now, we'll use placeholder data
    setTimeout(() => {
      setUsers([
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          status: "active",
          created: "2023-01-15",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "admin",
          status: "active",
          created: "2023-02-20",
        },
        {
          id: 3,
          name: "Mike Brown",
          email: "mike@example.com",
          role: "user",
          status: "inactive",
          created: "2023-03-05",
        },
        // Add more dummy users as needed
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const confirmDisable = (user) => {
    const isActive = user.status === "active";
    confirmDialog({
      message: `Are you sure you want to ${
        isActive ? "disable" : "enable"
      } this user?`,
      header: `${isActive ? "Disable" : "Enable"} Confirmation`,
      icon: "pi pi-info-circle",
      acceptClassName: isActive ? "p-button-danger" : "p-button-success",
      accept: () => toggleUserStatus(user),
    });
  };

  const toggleUserStatus = (user) => {
    // In a real app, you would call your API
    // For now, we'll just update the local state
    setUsers(
      users.map((u) =>
        u.id === user.id
          ? {
              ...u,
              status: u.status === "active" ? "inactive" : "active",
            }
          : u
      )
    );
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        severity={rowData.status === "active" ? "success" : "danger"}
        value={rowData.status === "active" ? "Active" : "Inactive"}
      />
    );
  };

  const roleBodyTemplate = (rowData) => {
    return (
      <Tag
        severity={rowData.role === "admin" ? "info" : "warning"}
        value={rowData.role === "admin" ? "Admin" : "User"}
      />
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-button-sm"
          onClick={() => setSelectedUser(rowData)}
        />
        <Button
          icon={rowData.status === "active" ? "pi pi-times" : "pi pi-check"}
          className={`p-button-rounded p-button-sm ${
            rowData.status === "active"
              ? "p-button-warning"
              : "p-button-success"
          }`}
          onClick={() => confirmDisable(rowData)}
          tooltip={rowData.status === "active" ? "Disable" : "Enable"}
          tooltipOptions={{ position: "top" }}
        />
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
          />
        </span>
      </div>

      <DataTable
        value={users}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        tableStyle={{ minWidth: "50rem" }}
        loading={loading}
        globalFilter={globalFilter}
        selection={selectedUser}
        onSelectionChange={(e) => setSelectedUser(e.value)}
        dataKey="id"
        className="bg-zinc-800/50"
      >
        <Column field="name" header="Name" sortable />
        <Column field="email" header="Email" sortable />
        <Column field="role" header="Role" body={roleBodyTemplate} sortable />
        <Column
          field="status"
          header="Status"
          body={statusBodyTemplate}
          sortable
        />
        <Column field="created" header="Registered" sortable />
        <Column header="Actions" body={actionBodyTemplate} />
      </DataTable>

      <ConfirmDialog />
    </div>
  );
}
