/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { type Analysis, type AgentOutput } from "@/app/db/schema/schema";

// Styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica',
        color: '#1a1a1a',
    },
    header: {
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
        borderBottomStyle: 'solid',
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
        color: '#f97316', // Orange
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 10,
        color: '#666666',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 700,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        borderBottomStyle: 'solid',
        paddingBottom: 4,
        color: '#333333',
    },
    summaryBox: {
        backgroundColor: '#f9fafb',
        padding: 15,
        borderRadius: 4,
        marginBottom: 20,
    },
    summaryText: {
        fontSize: 11,
        lineHeight: 1.5,
        color: '#374151',
    },
    verdictContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#fff7ed', // light orange
        padding: 15,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#fed7aa',
        borderStyle: 'solid',
    },
    verdictItem: {
        flex: 1,
    },
    verdictLabel: {
        fontSize: 10,
        color: '#9a3412',
        marginBottom: 4,
    },
    verdictValue: {
        fontSize: 16,
        fontWeight: 700,
        color: '#ea580c',
    },
    agentContainer: {
        marginBottom: 15,
        padding: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderStyle: 'solid',
        borderRadius: 4,
    },
    agentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    agentName: {
        fontSize: 12,
        fontWeight: 700,
    },
    riskScore: {
        fontSize: 12,
        fontWeight: 700,
        color: '#ef4444',
    },
    agentText: {
        fontSize: 10,
        lineHeight: 1.4,
        color: '#4b5563',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eeeeee',
        borderTopStyle: 'solid',
    },
    footerText: {
        fontSize: 8,
        color: '#9ca3af',
    },
});

interface PDFReportProps {
    ideaContent: string;
    analysis: Analysis;
    agentOutputs: AgentOutput[];
}

export function PDFReport({ ideaContent, analysis, agentOutputs }: PDFReportProps) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>RealityCheck-AI Report</Text>
                    <Text style={styles.subtitle}>Startup Viability Analysis</Text>
                </View>

                {/* Verdict Summary */}
                <View style={styles.verdictContainer}>
                    <View style={styles.verdictItem}>
                        <Text style={styles.verdictLabel}>SUCCESS PROBABILITY</Text>
                        <Text style={styles.verdictValue}>{analysis.probability}%</Text>
                    </View>
                    <View style={styles.verdictItem}>
                        <Text style={styles.verdictLabel}>VERDICT</Text>
                        <Text style={styles.verdictValue}>{analysis.verdict}</Text>
                    </View>
                </View>

                {/* Idea Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Initial Concept</Text>
                    <View style={styles.summaryBox}>
                        <Text style={styles.summaryText}>{ideaContent.substring(0, 500)}{ideaContent.length > 500 ? '...' : ''}</Text>
                    </View>
                </View>

                {/* Executive Summary */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Executive Summary</Text>
                    <Text style={styles.summaryText}>{analysis.summary}</Text>
                </View>

                {/* Agent Analysis */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Deep Dive Analysis</Text>
                    {agentOutputs.map((output, index) => (
                        <View key={index} style={styles.agentContainer}>
                            <View style={styles.agentHeader}>
                                <Text style={styles.agentName}>{output.agent}</Text>
                                <Text style={styles.riskScore}>Risk: {output.riskScore}/100</Text>
                            </View>
                            {/* Check if findings is string or JSON before rendering */}
                            <Text style={styles.agentText}>
                                {typeof output.findings === 'string'
                                    ? output.findings
                                    : (output.findings as { analysis?: string })?.analysis || "Analysis details included in platform."}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Generated by RealityCheck-AI • {new Date().toLocaleDateString()}
                    </Text>
                </View>
            </Page>
        </Document>
    );
}
