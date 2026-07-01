import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { ArrowLeft, Share2, Grid3x3, Heart } from "lucide-react-native";

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export default function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const { handle } = useLocalSearchParams<{ handle: string }>();

  // Mock data - in real app, fetch based on handle
  const user = {
    handle: `@${handle}`,
    displayName: handle?.charAt(0).toUpperCase() + (handle?.slice(1) || ""),
    bio: "Content creator | Making amazing clips ✨",
    followers: 89000,
    following: 456,
    likes: 1800000,
    isVerified: true,
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.handle}>{user.handle}</Text>
        <TouchableOpacity>
          <Share2 color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile info */}
        <View style={styles.profileInfo}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {handle?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
          </View>

          {/* Display name */}
          <Text style={styles.displayName}>
            {user.displayName}
            {user.isVerified && " ✓"}
          </Text>

          {/* Bio */}
          <Text style={styles.bio}>{user.bio}</Text>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {formatNumber(user.following)}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {formatNumber(user.followers)}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {formatNumber(user.likes)}
              </Text>
              <Text style={styles.statLabel}>Likes</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton}>
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Grid3x3 color="#fff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Heart color="#666" size={20} />
          </TouchableOpacity>
        </View>

        {/* Grid placeholder */}
        <View style={styles.gridContainer}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <View key={item} style={styles.gridItem}>
              <View style={styles.gridPlaceholder}>
                <Text style={styles.gridPlaceholderText}>▶</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  handle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  profileInfo: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "700",
  },
  displayName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  bio: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  statLabel: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#333",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
  },
  followButton: {
    flex: 1,
    backgroundColor: "#ff3b5c",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  followButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  messageButton: {
    flex: 1,
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#fff",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 2,
  },
  gridItem: {
    width: "33.33%",
    padding: 2,
  },
  gridPlaceholder: {
    aspectRatio: 9 / 12,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  gridPlaceholderText: {
    fontSize: 24,
    color: "#333",
  },
});
