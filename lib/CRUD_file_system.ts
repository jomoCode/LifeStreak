import { File, Directory, Paths } from 'expo-file-system';
import { cleanFileName  } from "./generic_helpers";

const fileDir = new Directory(Paths.document, "streak");
const file = new File(fileDir, "events.json");
const fileUri = file.uri;

// TYPES
type Event = {
  startDate: string; // stored as ISO string
  interval: number;
  duration: number;
  startTime: string; // stored as ISO string
  No_of_times_checked: number;
  No_of_times_to_be_checked: number;
  expired: boolean;
  event_id: string;
  last_checked: string; // stored as ISO string
};

// HELPERS
// Read storage data. Returns an object whose values are event objects or a fail object
const readEvents = async (): Promise<Record<string, Event|string>> => {
  if (!file.exists) return {'fail': 'storage file not found'};
  const eventData = file.textSync();
  return eventData ? JSON.parse(eventData) : {'pass': 'no data'};
};



export { readEvents };