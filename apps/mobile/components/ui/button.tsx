import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  className?: string;
}

const buttonVariants = {
  default: {
    backgroundColor: "#fff",
  },
  secondary: {
    backgroundColor: "#333",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  destructive: {
    backgroundColor: "#dc2626",
  },
};

const buttonSizes = {
  default: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  icon: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
};

const textVariants: Record<string, TextStyle> = {
  default: { color: "#000" },
  secondary: { color: "#fff" },
  outline: { color: "#fff" },
  ghost: { color: "#fff" },
  destructive: { color: "#fff" },
};

export function Button({
  children,
  variant = "default",
  size = "default",
  onPress,
  disabled = false,
  style,
  className,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        buttonVariants[variant],
        buttonSizes[size],
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      {typeof children === "string" ? (
        <Text style={[styles.text, textVariants[variant]]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
