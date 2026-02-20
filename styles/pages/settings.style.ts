import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  bottleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
    justifyContent: "space-between",
  },
  bottleOption: {
    width: "30%",
    padding: 12,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    gap: 8,
  },
  bottlePreview: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  bottleLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  timeInputs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexGrow: 0,
    justifyContent: "flex-end",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.5,
  },
  settingCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  settingRowContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  settingSeparator: {
    height: 1,
    marginTop: 16,
    backgroundColor: "#000",
    width: "100%",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  settingSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
