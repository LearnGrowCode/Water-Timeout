import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bubbleWrapper: {
    position: "absolute",
    top: 0,
    zIndex: 10,
    alignItems: "center",
  },
  bubble: {
    backgroundColor: "black",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    maxWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bubbleText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  bubbleTail: {
    position: "absolute",
    bottom: -6,
    left: "50%",
    marginLeft: -6,
    width: 12,
    height: 12,
    backgroundColor: "black",
    transform: [{ rotate: "45deg" }],
  },
});
