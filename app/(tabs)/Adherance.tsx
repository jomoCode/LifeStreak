import { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Task } from "@/types";
import { useDb } from "@/context/useBackend";

/**
 * This screen is UI-only.
 * It does not calculate adherence directly.
 * It derives basic stats that can later be replaced
 * by a dedicated adherence engine.
 */

type Scope = "overall" | "task";
type Range = "all" | "7d" | "30d";

const AdherenceScreen = () => {
  const { data: tasks, loading } = useDb();

  const [scope, setScope] = useState<Scope>("overall");
  const [range, setRange] = useState<Range>("all");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  /**
   * Placeholder adherence computation.
   * Replace this block with your adherence engine later.
   */
  const stats = useMemo(() => {
    if (tasks.length === 0) {
      return {
        totalEvents: 0,
        checkedEvents: 0,
        adherenceRate: 0,
        punctuality: 0,
      };
    }

    // For now we simulate stats using task count
    const totalEvents = tasks.length * 10;
    const checkedEvents = Math.floor(totalEvents * 0.7);

    return {
      totalEvents,
      checkedEvents,
      adherenceRate: Math.round(
        (checkedEvents / totalEvents) * 100
      ),
      punctuality: 72,
    };
  }, [tasks, scope, range, selectedTaskId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading adherence data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Adherence</Text>

      {/* Scope Filter */}
      <View style={styles.section}>
        <Text style={styles.label}>Scope</Text>
        <Picker selectedValue={scope} onValueChange={setScope}>
          <Picker.Item label="Overall" value="overall" />
          <Picker.Item label="Per Task" value="task" />
        </Picker>
      </View>

      {/* Task Filter */}
      {scope === "task" && (
        <View style={styles.section}>
          <Text style={styles.label}>Task</Text>
          <Picker
            selectedValue={selectedTaskId}
            onValueChange={setSelectedTaskId}
          >
            <Picker.Item label="Select a task" value={null} />
            {tasks.map((task: Task) => (
              <Picker.Item
                key={task.id}
                label={task.name}
                value={task.id}
              />
            ))}
          </Picker>
        </View>
      )}

      {/* Time Range Filter */}
      <View style={styles.section}>
        <Text style={styles.label}>Time Range</Text>
        <View style={styles.row}>
          {(["all", "7d", "30d"] as Range[]).map((r) => (
            <Pressable
              key={r}
              onPress={() => setRange(r)}
              style={[
                styles.chip,
                range === r && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  range === r && styles.chipTextActive,
                ]}
              >
                {r === "all"
                  ? "All"
                  : r === "7d"
                  ? "Last 7 Days"
                  : "Last 30 Days"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.card}>
        <Text style={styles.stat}>
          Total Events: {stats.totalEvents}
        </Text>
        <Text style={styles.stat}>
          Completed: {stats.checkedEvents}
        </Text>
        <Text style={styles.stat}>
          Adherence Rate: {stats.adherenceRate}%
        </Text>
        <Text style={styles.stat}>
          Punctuality: {stats.punctuality}%
        </Text>
      </View>

      {/* Task List (when overall) */}
      {scope === "overall" && (
        <View style={styles.section}>
          <Text style={styles.label}>Tasks</Text>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.taskRow}>
                <Text style={styles.taskName}>{item.name}</Text>
                <Text style={styles.taskMeta}>
                  {item.schedule.type}
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default AdherenceScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  chipActive: {
    backgroundColor: "#000",
  },
  chipText: {
    fontSize: 12,
    color: "#000",
  },
  chipTextActive: {
    color: "#fff",
  },
  card: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f4f4f4",
    marginBottom: 16,
  },
  stat: {
    fontSize: 16,
    marginBottom: 6,
  },
  taskRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskName: {
    fontSize: 16,
  },
  taskMeta: {
    fontSize: 12,
    color: "#666",
  },
});
