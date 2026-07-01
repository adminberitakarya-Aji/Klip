import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Camera, Image, Music, Type } from "lucide-react-native";

export default function UploadScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create</Text>
      </View>

      {/* Camera placeholder */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraPlaceholder}>
          <Camera color="#666" size={64} />
          <Text style={styles.cameraText}>Tap to record</Text>
        </View>
      </View>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {/* Effects row */}
        <View style={styles.effectsRow}>
          <TouchableOpacity style={styles.effectButton}>
            <Text style={styles.effectIcon}>😊</Text>
            <Text style={styles.effectText}>Effects</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.effectButton}>
            <Music color="#fff" size={20} />
            <Text style={styles.effectText}>Sounds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.effectButton}>
            <Type color="#fff" size={20} />
            <Text style={styles.effectText}>Text</Text>
          </TouchableOpacity>
        </View>

        {/* Record button */}
        <View style={styles.recordButtonContainer}>
          <TouchableOpacity style={styles.recordButtonOuter}>
            <View style={styles.recordButtonInner} />
          </TouchableOpacity>
        </View>

        {/* Gallery button */}
        <TouchableOpacity style={styles.galleryButton}>
          <Image color="#fff" size={24} />
          <Text style={styles.galleryText}>Upload</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraPlaceholder: {
    width: "90%",
    aspectRatio: 9 / 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  cameraText: {
    color: "#666",
    fontSize: 16,
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 20,
  },
  effectsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  effectButton: {
    alignItems: "center",
    gap: 4,
  },
  effectIcon: {
    fontSize: 24,
  },
  effectText: {
    color: "#fff",
    fontSize: 12,
  },
  recordButtonContainer: {
    alignItems: "center",
  },
  recordButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#ff3b5c",
  },
  galleryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 12,
    borderRadius: 8,
  },
  galleryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
