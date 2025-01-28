import { Platform, StyleSheet } from "react-native";

const PageStyles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Platform.OS === "web" ? 20 : 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 20,
    textAlign: "center",
  },
  titleClr: {
    color: "#3182ce",
  },
  inputContainer: {
    marginBottom: 10,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4a5568",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    color: "#4a5568",
    fontSize: 16,
    width: "100%",
  },
  errorMessage: {
    color: "#e53e3e",
    fontSize: 12,
    marginTop: 4,
  },
  fieldError: {
    color: "#e53e3e",
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 2,
  },
  button: {
    backgroundColor: "#3182ce",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  footer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "#4a5568",
  },
  footerLink: {
    color: "#3182ce",
    fontWeight: "600",
  },
});

export default PageStyles;
