import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  View,
  Animated,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async () => {
    if (!disabled && !loading) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14, iconSize: 16 },
    md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 16, iconSize: 20 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 18, iconSize: 24 },
  };

  const currentSize = sizeStyles[size];

  const renderContent = () => {
    const textColor = variant === 'outline' || variant === 'ghost' 
      ? '#8b5cf6' 
      : variant === 'secondary' 
        ? '#f8fafc'
        : '#ffffff';
    
    const content = (
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator color={textColor} size="small" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Ionicons
                name={icon}
                size={currentSize.iconSize}
                color={textColor}
                style={{ marginRight: 8 }}
              />
            )}
            <Text
              style={[
                styles.text,
                { fontSize: currentSize.fontSize, color: textColor },
                (variant === 'primary' || variant === 'accent') && styles.textBold,
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Ionicons
                name={icon}
                size={currentSize.iconSize}
                color={textColor}
                style={{ marginLeft: 8 }}
              />
            )}
          </>
        )}
      </View>
    );

    if (variant === 'primary') {
      return (
        <LinearGradient
          colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            {
              paddingVertical: currentSize.paddingVertical,
              paddingHorizontal: currentSize.paddingHorizontal,
            },
          ]}
        >
          {content}
        </LinearGradient>
      );
    }

    if (variant === 'accent') {
      return (
        <LinearGradient
          colors={['#fbbf24', '#f59e0b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            {
              paddingVertical: currentSize.paddingVertical,
              paddingHorizontal: currentSize.paddingHorizontal,
            },
          ]}
        >
          {content}
        </LinearGradient>
      );
    }

    return content;
  };

  const getContainerStyle = () => {
    const baseStyle = [
      styles.container,
      fullWidth && styles.fullWidth,
      {
        paddingVertical: variant === 'primary' || variant === 'accent' ? 0 : currentSize.paddingVertical,
        paddingHorizontal: variant === 'primary' || variant === 'accent' ? 0 : currentSize.paddingHorizontal,
      },
    ];

    switch (variant) {
      case 'secondary':
        return [...baseStyle, styles.secondary];
      case 'outline':
        return [...baseStyle, styles.outline];
      case 'ghost':
        return [...baseStyle, styles.ghost];
      case 'destructive':
        return [...baseStyle, styles.destructive];
      default:
        return baseStyle;
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], width: fullWidth ? '100%' : undefined }}>
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={[
          getContainerStyle(),
          (disabled || loading) && styles.disabled,
        ]}
      >
        {renderContent()}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  gradient: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9999,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  textBold: {
    fontWeight: '700',
  },
  secondary: {
    backgroundColor: '#1e293b',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: '#ef4444',
  },
  disabled: {
    opacity: 0.5,
  },
});