import { StyleSheet } from 'react-native';

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
        fontWeight: '700',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.7,
    },
    settingHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 16,
        justifyContent: 'space-between',
    },
    bottleOption: {
        width: '30%',
        padding: 12,
        borderRadius: 16,
        borderWidth: 2,
        alignItems: 'center',
        gap: 8,
    },
    bottlePreview: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottleLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    timeInputs: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    settingCard: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    settingTitleContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    settingSubtitle: {
        fontSize: 13,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
});
