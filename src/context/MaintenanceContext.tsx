import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MaintenanceState {
  enabled: boolean;
  message: string;
}

interface MaintenanceContextType {
  maintenance: MaintenanceState;
  setMaintenance: (state: MaintenanceState) => Promise<void>;
  isLoading: boolean;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export function MaintenanceProvider({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenanceState] = useState<MaintenanceState>({
    enabled: false,
    message: "Site is under maintenance. Please check back later."
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMaintenanceState();
    
    // Subscribe to changes
    const channel = supabase
      .channel('maintenance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'secrets',
          filter: 'name=eq.maintenance_mode'
        },
        () => {
          fetchMaintenanceState();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMaintenanceState = async () => {
    try {
      const { data, error } = await supabase
        .from('secrets')
        .select('value')
        .eq('name', 'maintenance_mode')
        .single();

      if (error) {
        console.error('Error fetching maintenance state:', error);
        return;
      }

      if (data?.value) {
        setMaintenanceState(data.value as MaintenanceState);
      }
    } catch (error) {
      console.error('Error fetching maintenance state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setMaintenance = async (state: MaintenanceState) => {
    try {
      const { error } = await supabase
        .from('secrets')
        .update({ value: state })
        .eq('name', 'maintenance_mode');

      if (error) throw error;
      setMaintenanceState(state);
    } catch (error) {
      console.error('Error updating maintenance state:', error);
      throw error;
    }
  };

  return (
    <MaintenanceContext.Provider value={{ maintenance, setMaintenance, isLoading }}>
      {children}
    </MaintenanceContext.Provider>
  );
}

export function useMaintenance() {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
}