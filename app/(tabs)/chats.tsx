import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/ui/Avatar';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatusIndicator } from '@/components/shared/StatusIndicator';
import type { Chat } from '@/types';

export default function ChatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { chats, isLoading, fetchChats } = useStore();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchChats();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const renderChatItem = ({ item, index }: { item: Chat; index: number }) => {
    const otherParticipant = item.participants[0];
    
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <Pressable
          style={({ pressed }) => [
            styles.chatItem,
            pressed && styles.chatItemPressed,
          ]}
          onPress={() => router.push(`/chat/${item.id}`)}
        >
          <View style={styles.avatarContainer}>
            <Avatar
              source={otherParticipant.avatar}
              name={otherParticipant.name}
              size="lg"
            />
            <View style={styles.statusDot}>
              <StatusIndicator status="online" size="sm" />
            </View>
          </View>

          <View style={styles.chatContent}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatName} numberOfLines={1}>
                {otherParticipant.name}
              </Text>
              <Text style={styles.chatTime}>
                {formatDistanceToNow(item.lastMessageTime, { addSuffix: true })}
              </Text>
            </View>

            {item.propertyTitle && (
              <View style={styles.propertyBadge}>
                <Ionicons name="home-outline" size={12} color="#8b5cf6" />
                <Text style={styles.propertyTitle} numberOfLines={1}>
                  {item.propertyTitle}
                </Text>
              </View>
            )}

            <View style={styles.lastMessageRow}>
              <Text
                style={[
                  styles.lastMessage,
                  item.unreadCount > 0 && styles.lastMessageUnread,
                ]}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>

          {item.propertyImage && (
            <Image
              source={{ uri: item.propertyImage }}
              style={styles.propertyImage}
              contentFit="cover"
            />
          )}
        </Pressable>
      </Animated.View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="chatbubbles-outline" size={48} color="#64748b" />
      </View>
      <Text style={styles.emptyTitle}>No conversations yet</Text>
      <Text style={styles.emptyText}>
        Start chatting with sellers by inquiring about a property
      </Text>
    </View>
  );

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.skeletonItem}>
          <Skeleton width={56} height={56} borderRadius={28} />
          <View style={styles.skeletonContent}>
            <Skeleton width="60%" height={18} style={{ marginBottom: 8 }} />
            <Skeleton width="80%" height={14} style={{ marginBottom: 6 }} />
            <Skeleton width="40%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Pressable style={styles.newChatButton}>
          <Ionicons name="create-outline" size={24} color="#8b5cf6" />
        </Pressable>
      </View>

      {isLoading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#f8fafc',
  },
  newChatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  chatItemPressed: {
    backgroundColor: '#1e293b',
  },
  avatarContainer: {
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  chatContent: {
    flex: 1,
    marginLeft: 14,
    marginRight: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    flex: 1,
    marginRight: 8,
  },
  chatTime: {
    fontSize: 12,
    color: '#64748b',
  },
  propertyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  propertyTitle: {
    fontSize: 11,
    color: '#a78bfa',
    marginLeft: 4,
    maxWidth: 150,
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#94a3b8',
    flex: 1,
  },
  lastMessageUnread: {
    color: '#f8fafc',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#8b5cf6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  propertyImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
  },
  skeletonContainer: {
    padding: 20,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  skeletonContent: {
    flex: 1,
    marginLeft: 14,
  },
});