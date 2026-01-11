import React, { useState } from "react";
import { Modal, View, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type LsDateProps = {
  selectedDate: (date: string) => void;
  open: boolean;
  onOpen: (state: boolean) => void;
};

const LsDate = ({ selectedDate, open, onOpen }: LsDateProps) => {
  const [date, setDate] = useState(new Date());

  const formatYYMMDD = (d: Date) => {
    const yy = d.getFullYear().toString().slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yy}${mm}${dd}`;
  };

  return (
    <>
      {open && (
        <Modal transparent animationType="fade">
          <View style={styles.overlay}>
            <View style={styles.modalBox}>
              <DateTimePicker
                value={date}
                mode="date"
                onChange={(e, d) => {
                  if (d) {
                    setDate(d);
                    selectedDate(formatYYMMDD(d));
                  }

                  // Close modal automatically on Android
                  if (Platform.OS === "android") {
                    onOpen(false);
                  }
                }}
              />
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

export { LsDate };
