import ReduxProvider from "../../../components/ReduxProvider";
import SpeciesManagerWrapper from "../../../components/SpeciesManagerWrapper";

export default function SpeciesManagerPage() {
  return (
    <ReduxProvider>
      <div className="">
       
        <SpeciesManagerWrapper />
      </div>
    </ReduxProvider>
  );
}
