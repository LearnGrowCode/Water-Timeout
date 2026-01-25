import { styles } from '@/styles/ui/Dropdown.style';
import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface DropdownProps {
    label: string;
    value: string | number;
    options: (string | number)[];
    onSelect: (value: any) => void;
    suffix?: string;
    renderOption?: (value: any) => string;
    description?: string;
    theme: any;
}

export const Dropdown = ({ label, value, options, onSelect, suffix, renderOption, description, theme }: DropdownProps) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <TouchableOpacity
                style={[styles.dropdownTrigger, { backgroundColor: theme.secondaryBackground }]}
                onPress={() => setModalVisible(true)}
            >
                <Text style={[styles.dropdownTriggerText, { color: theme.text }]}>
                    {renderOption ? renderOption(value) : value}{!renderOption && suffix ? ` ${suffix}` : ''}
                </Text>
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
                        {description && <Text style={[styles.modalDescription, { color: theme.icon }]}>{description}</Text>}
                        <ScrollView showsVerticalScrollIndicator={false}>
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
                                        {renderOption ? renderOption(option) : option}{!renderOption && suffix ? ` ${suffix}` : ''}
                                    </Text>
                                    {value === option && <View style={[styles.activeDot, { backgroundColor: theme.tint }]} />}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

