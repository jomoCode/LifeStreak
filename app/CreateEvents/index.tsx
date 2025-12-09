import CreateEvent from "@/components/ui/Template/CreateEvent";

const EventTitle = () => {
  return (
    <CreateEvent
      title="Enter your goal"
      field="goalTitle"
      placeholder="e.g Read 10 pages in 10 days"
    />
  );
};

export default EventTitle;
