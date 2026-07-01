import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention";
  user: {
    handle: string;
    displayName: string;
  };
  message: string;
  time: string;
  isRead: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "like",
    user: { handle: "@johndoe", displayName: "John Doe" },
    message: "liked your clip",
    time: "2m ago",
    isRead: false,
  },
  {
    id: "2",
    type: "comment",
    user: { handle: "@janesmith", displayName: "Jane Smith" },
    message: "commented: \"Amazing! 🔥\"",
    time: "15m ago",
    isRead: false,
  },
  {
    id: "3",
    type: "follow",
    user: { handle: "@mikewilson", displayName: "Mike Wilson" },
    message: "started following you",
    time: "1h ago",
    isRead: true,
  },
  {
    id: "4",
    type: "mention",
    user: { handle: "@sarahlee", displayName: "Sarah Lee" },
    message: "mentioned you in a comment",
    time: "3h ago",
    isRead: true,
  },
  {
    id: "5",
    type: "like",
    user: { handle: "@alexchen", displayName: "Alex Chen" },
    message: "liked your clip",
    time: "5h ago",
    isRead: true,
  },
];

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "like":
      return "♥";
    case "comment":
      return "💬";
    case "follow":
      return "👤";
    case "mention":
      return "@";
    default:
      return "•";
  }
}

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadItem,
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          {getNotificationIcon(notification.type)}
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.message}>
          <Text style={styles.displayName}>
            {notification.user.displayName}
          </Text>{" "}
          {notification.message}
        </Text>
        <Text style={styles.time}>{notification.time}</Text>
      </View>
      {!notification.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

export default function InboxScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Inbox</Text>
        <TouchableOpacity>
          <Text style={styles.markAllRead}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications list */}
      <FlatList
        data={MOCK_NOTIFICATIONS}
        renderItem={({ item }) => <NotificationItem notification={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  markAllRead: {
    color: "#007AFF",
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  unreadItem: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  message: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
  displayName: {
    fontWeight: "600",
  },
  time: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
  },
});
