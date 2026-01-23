import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { styles } from './SettingRow.style';

interface SettingRowProps {
    icon: any;
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    style?: ViewStyle;
    theme: any;
}

export const SettingRow = ({ icon: Icon, title, subtitle, children, style, theme }: SettingRowProps) => (
    <View style={[styles.settingCard, { backgroundColor: 'white' }, style]}>
        <View style={styles.settingHeader}>
            <View style={[styles.iconContainer, { backgroundColor: theme.tint + '10' }]}>
                <Icon size={20} color={theme.tint} />
            </View>
            <View style={styles.settingTitleContainer}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
                {subtitle && <Text style={[styles.settingSubtitle, { color: theme.icon }]}>{subtitle}</Text>}
            </View>
            {children}
        </View>
    </View>
);

