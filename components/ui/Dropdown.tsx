import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from './Dropdown.style';

interface DropdownProps {
    label: string;
    value: string | number;
    options: (string | number)[];
    onSelect: (value: any) => void;
    suffix?: string;
    theme: any;
}

export const Dropdown = ({ label, value, options, onSelect, suffix, theme }: DropdownProps) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <TouchableOpacity
                style={[styles.dropdownTrigger, { backgroundColor: theme.secondaryBackground }]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={[styles.dropdownTriggerText, { color: theme.text }]}>{value}</Text>
                <ChevronDown size={16} color={theme.icon} />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <Animated.View
                        entering={FadeInDown.duration(200)}
                        style={[styles.modalContent, { backgroundColor: theme.card }]}
                    >
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Select {label}</Text>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.toString()}
                                style={[
                                    styles.optionItem,
                                    value === option && { backgroundColor: theme.tint + '10' }
                                ]}
                                onPress={() => {
                                    onSelect(option);
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={[
                                    styles.optionText,
                                    { color: theme.text },
                                    value === option && { color: theme.tint, fontWeight: '700' }
                                ]}>
                                    {option}{suffix ? ` ${suffix}` : ''}
                                </Text>
                                {value === option && <View style={[styles.activeDot, { backgroundColor: theme.tint }]} />}
                            </TouchableOpacity>
                        ))}
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

