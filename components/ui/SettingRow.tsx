import { styles } from "@/styles/ui/SettingRow.style";
import React from "react";
import { Text, View, ViewStyle } from "react-native";

interface SettingRowProps {
  icon: any;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  theme: any;
  alignment?: "row" | "col";
}

export const SettingRow = ({
  icon: Icon,
  title,
  subtitle,
  children,
  style,
  theme,
  alignment = "row",
}: SettingRowProps) => {
  if (alignment === "col") {
    return (
      <View>
        <View style={[styles.settingRow, style]}>
          <View style={[styles.iconContainer, { backgroundColor: theme.tint + "10" }]}>
            <Icon size={20} color={theme.tint} />
          </View>

          <View style={styles.contentContainer}>
            <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.settingSubtitle, { color: theme.icon }]}>{subtitle}</Text>
            )}
          </View>
        </View>

        <View style={styles.rightContainer}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.settingRow, style]}>
      <View style={[styles.iconContainer, { backgroundColor: theme.tint + "10" }]}>
        <Icon size={20} color={theme.tint} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme.icon }]}>{subtitle}</Text>
        )}
      </View>

      <View style={styles.rightContainer}>{children}</View>
    </View>
  );
};