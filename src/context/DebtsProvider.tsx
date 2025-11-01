import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export interface DebtsFilters {
  statuses: string[];
  category: string | null;
  search: string;
  householdMember: string | null;
  onlyCritical: boolean;
}

interface DebtsContextValue {
  selectedDebtId: string | null;
  setSelectedDebtId: (id: string | null) => void;
  filters: DebtsFilters;
  setFilters: (filters: DebtsFilters) => void;
  openCreation: () => void;
  closeCreation: () => void;
  isCreationOpen: boolean;
}

const defaultFilters: DebtsFilters = {
  statuses: [],
  category: null,
  search: "",
  householdMember: null,
  onlyCritical: false
};

const DebtsContext = createContext<DebtsContextValue>({
  selectedDebtId: null,
  setSelectedDebtId: () => {},
  filters: defaultFilters,
  setFilters: () => {},
  openCreation: () => {},
  closeCreation: () => {},
  isCreationOpen: false
});

export const DebtsProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [filters, setFilters] = useState<DebtsFilters>(defaultFilters);
  const [isCreationOpen, setIsCreationOpen] = useState(false);

  const value = useMemo(
    () => ({
      selectedDebtId,
      setSelectedDebtId,
      filters,
      setFilters,
      openCreation: () => setIsCreationOpen(true),
      closeCreation: () => setIsCreationOpen(false),
      isCreationOpen
    }),
    [selectedDebtId, filters, isCreationOpen]
  );

  return <DebtsContext.Provider value={value}>{children}</DebtsContext.Provider>;
};

export const useDebtsContext = () => useContext(DebtsContext);
