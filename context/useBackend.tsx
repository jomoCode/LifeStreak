import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Task } from "@/types";
import { initDBAsync } from "@/lib/database/initializeDb";
import { readTasksAsync } from "@/lib/database/databaseHandlers";

type DbProviderProps = { children: ReactNode };

type BackendContextProps = {
  loading: boolean;
  data: Task[];
  refresh: () => void;
};

const BackendContext = createContext<BackendContextProps | undefined>(
  undefined
);

export const DbProvider = ({ children }: DbProviderProps) => {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => setRefreshing((v) => !v);

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      try {
        const db = await initDBAsync();
        const tasks = await readTasksAsync(db);
        setData(tasks);
      } catch (err) {
        console.error("Failed to load tasks:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [refreshing]);

  return (
    <BackendContext.Provider value={{ loading, data, refresh }}>
      {children}
    </BackendContext.Provider>
  );
};

export const useDb = () => {
  const context = useContext(BackendContext);
  if (!context) throw new Error("useDb must be used within DbProvider");
  return context;
};

