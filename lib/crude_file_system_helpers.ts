import { Event } from "./CRUD_file_system";
import { validateUTCDateString } from "./generic_helpers";

const isEventViableToday = (event: Event) => {
  validateUTCDateString(event.startDate, "startDate");
  validateUTCDateString(event.last_checked, "last_checked");

  const startDate = new Date(event.startDate);
  const lastChecked = new Date(event.last_checked);
  const today = new Date().getUTCDay();

  // already checked today
  if (lastChecked.getUTCDay() === today) {
    console.log("Event has already been checked today");
    return false;
  }

  for (let i = event.interval; i < event.duration; i += event.interval) {
    const viableDate = new Date(startDate);
    viableDate.setDate(startDate.getDate() + i);

    if (viableDate.getUTCDay() === today) {
      return true;
    }
  }
  return false;
};

export { isEventViableToday };
