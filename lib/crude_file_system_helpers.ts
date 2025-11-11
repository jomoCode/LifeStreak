// Moved to sqlite

// export const getViableEventsToday = async (): Promise<Event[] | { error: string }> => {
//   try {
//     const today = new Date();
//     const todayISO = getTodayMidnightUTC();

//     const events = await runSql<Event>(`
//       SELECT *, 
//       CAST((julianday(?) - julianday(startDate)) AS INTEGER) AS days_since_start
//       FROM events
//       WHERE expired = 0
//         AND No_of_times_checked < No_of_times_to_be_checked
//     `, [todayISO]);

//     // Filter events whose interval matches today
//     const viableEvents = events.filter(event => {
//       const { days_since_start, interval, duration } = event as any;
//       return days_since_start >= 0 && days_since_start <= duration && days_since_start % interval === 0;
//     });

//     return viableEvents;
//   } catch (error: unknown) {
//     return { error: `Error fetching viable events: ${error}` };
//   }
// };


// export const tickEvent = async (event_id: string) => {
//   try {
//     const todayISO = getTodayMidnightUTC();
//     const eventArr = await runSql<Event>(
//       `SELECT *, CAST((julianday(?) - julianday(startDate)) AS INTEGER) AS days_since_start 
//        FROM events WHERE event_id = ?`,
//       [todayISO, event_id]
//     );

//     if (!eventArr[0]) return { failure: "Event not found" };

//     const event = eventArr[0] as any;
//     const { days_since_start, interval, duration, No_of_times_checked, No_of_times_to_be_checked } = event;

//     if (No_of_times_checked >= No_of_times_to_be_checked) return { failure: "Event completed" };
//     if (days_since_start < 0 || days_since_start > duration || days_since_start % interval !== 0)
//       return { failure: "Event not viable today" };

//     // Update the DB directly
//     await runSql(
//       `UPDATE events
//        SET No_of_times_checked = No_of_times_checked + 1,
//            last_checked = ?
//        WHERE event_id = ?`,
//       [todayISO, event_id]
//     );

//     return { success: "Event ticked" };
//   } catch (error) {
//     return { error: `Error ticking event: ${error}` };
//   }
// };
