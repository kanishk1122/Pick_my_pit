import PetsList from '@/components/PetsList';

export default function Page() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Pets Management
        </h1>
        <p className="text-zinc-400 mt-2">Manage and track all pets in the system</p>
      </div>
      <PetsList />
    </div>
  );
}
