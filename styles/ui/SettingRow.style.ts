import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    minHeight: 56,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
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
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
});
