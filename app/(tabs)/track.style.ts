import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
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
    listContent: {
        padding: 16,
        paddingTop: 0,
    },
    card: {
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    dateText: {
        fontSize: 17,
        fontWeight: '700',
    },
    resetButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    resetText: {
        fontSize: 11,
        fontWeight: '700',
    },
    subText: {
        fontSize: 13,
        fontWeight: '500',
    },
    pointsContainer: {
        alignItems: 'flex-end',
    },
    pointsText: {
        fontSize: 20,
        fontWeight: '800',
    },
    pointsSub: {
        fontSize: 11,
        fontWeight: '600',
        marginRight: 4,
    },
    chevronRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expandedContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    divider: {
        height: 1,
        width: '100%',
        marginBottom: 12,
        borderRadius: 1,
    },
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    logLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logEmoji: {
        fontSize: 18,
    },
    logLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    logTime: {
        fontSize: 12,
        fontWeight: '500',
    },
});
