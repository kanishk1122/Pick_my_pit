"use client";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import PetsList from "@/components/PetsList";

export default function PetsPage() {
  const { user, isAuthenticated, loading } = useAuth();

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
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="ml-64 flex-1">
        <header className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 h-16 flex items-center px-6">
          <div className="flex-1">
            <h2 className="text-lg font-medium text-white">
              Pet Admin Dashboard
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-zinc-400">
              Logged in as: <span className="text-zinc-200">{user?.email}</span>
            </div>
          </div>
        </header>
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Pets Management
            </h1>
            <p className="text-zinc-400 mt-2">
              Manage and track all pets in the system
            </p>
          </div>
          <PetsList />
        </main>
      </div>
    </div>
  );
}
