import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface PriceItem {
  label: string;
  value: number;
  type?: 'normal' | 'discount' | 'total';
}

interface PriceBreakdownProps {
  items: PriceItem[];
  showSecure?: boolean;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  items,
  showSecure = true,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View
          key={index}
          style={[
            styles.row,
            item.type === 'total' && styles.totalRow,
          ]}
        >
          <Text
            style={[
              styles.label,
              item.type === 'total' && styles.totalLabel,
              item.type === 'discount' && styles.discountLabel,
            ]}
          >
            {item.label}
          </Text>
          <Text
            style={[
              styles.value,
              item.type === 'total' && styles.totalValue,
              item.type === 'discount' && styles.discountValue,
            ]}
          >
            {item.type === 'discount' ? '-' : ''}{formatCurrency(item.value)}
          </Text>
        </View>
      ))}
      {showSecure && (
        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark" size={16} color="#10b981" />
          <Text style={styles.secureText}>Secured by LuxeEstates Protection</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    marginTop: 8,
    paddingTop: 16,
  },
  label: {
    fontSize: 14,
    color: '#94a3b8',
  },
  value: {
    fontSize: 14,
    color: '#f8fafc',
    fontWeight: '500',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f8fafc',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  discountLabel: {
    color: '#10b981',
  },
  discountValue: {
    color: '#10b981',
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  secureText: {
    fontSize: 12,
    color: '#10b981',
    marginLeft: 6,
  },
});