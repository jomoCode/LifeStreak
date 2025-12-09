import { LsButton } from "@/components/ui/atoms/LsButton";
import React, { useState } from "react";
import { Modal, View, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type LsDateProps = { selectedDate: (date: string) => void };

const LsDate = ({ selectedDate }: LsDateProps) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const formatYYMMDD = (d: Date) => {
    const yy = d.getFullYear().toString().slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yy}${mm}${dd}`;
  };

  return (
    <>
      <LsButton text="Select Date" onPress={() => setOpen(true)} />

      {open && (
        <Modal transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.modalBox}>
              <DateTimePicker
                value={date}
                onChange={(e, d) => {
                  if (d) {
                    setDate(d);
                    selectedDate(formatYYMMDD(d));
                  }

                  // Auto close for android
                  if (Platform.OS === "android") setOpen(false);
                }}
                mode="date"
              />

              {/* iOS needs a button to close */}
              {Platform.OS === "ios" && (
                <LsButton text="Done" onPress={() => setOpen(false)} />
              )}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
});

export default LsDate;
