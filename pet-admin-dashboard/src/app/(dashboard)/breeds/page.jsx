import ReduxProvider from "@components/ReduxProvider";
import BreedManagerWrapper from "@components/BreedManagerWrapper";

export default function BreedManagerPage() {
  return (
    <ReduxProvider>
      <div className="p-4">
        
        <BreedManagerWrapper />
      </div>
    </ReduxProvider>
  );
}
