import { Event, readEvents } from "@/lib/CRUDE_sqlite";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type DbProviderProps = { children: ReactNode };
type BackendContextProps = {
  loading: boolean;
  data: Event[];
  refresh: () => void;
};
const BackendContext = createContext<BackendContextProps | undefined>(
  undefined
);

export const DbProvider = ({ children }: DbProviderProps) => {
  const [data, setData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Toggle to update component state and trigger data fetching
  const refresh = () => {
    setRefreshing(!refreshing);
  };

  useEffect(() => {
    const loadEventsFromDb = async () => {
      try {
        // Get data from backend
        setLoading(true);
        const events = await readEvents();
        if (!events) {
          setData([]);
          return;
        }

        // Validate data is  Errorless
        if (typeof events === "object") {
          if ("error" in events) {
            console.error("Error reading events:", events.error);
            setData([]);
            return;
          }
          if ("fail" in events) {
            setData([]);
            return;
          }
          if ("pass" in events) {
            console.log("Pass message:", events.pass);
            setData([]);
            return;
          }
        }
        setData(events);
      } catch (err) {
        console.error("Error loading events:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadEventsFromDb();
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
