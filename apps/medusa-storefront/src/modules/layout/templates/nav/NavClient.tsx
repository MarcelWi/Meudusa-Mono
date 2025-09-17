"use client";

import { HttpTypes } from "@medusajs/types";
import { useToggleState} from "@medusajs/ui";
import CountrySelect from "@modules/layout/components/country-select";

export default function NavClient({ regions }: { regions: HttpTypes.StoreRegion[] }) {
  const toggleState = useToggleState();

  return (
    <div
      className="flex justify-between"
      onMouseEnter={toggleState.open}
      onMouseLeave={toggleState.close}
    >
      {regions && (
        <CountrySelect
          toggleState={toggleState}
          regions={regions}
        />
      )}
    </div>
  );
}