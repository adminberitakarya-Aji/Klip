import { View, Text, FlatList, Dimensions, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCallback, useRef, useState } from "react";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Clip {
  id: string;
  user: {
    handle: string;
    displayName: string;
    avatarUrl: string;
    isVerified?: boolean;
  };
  caption: string;
  likes: number;
  comments: number;
  shares: number;
}

const MOCK_CLIPS: Clip[] = [
  {
    id: "1",
    user: {
      handle: "@johndoe",
      displayName: "John Doe",
      avatarUrl: "https://i.pravatar.cc/150?u=johndoe",
      isVerified: true,
    },
    caption: "Check out this amazing view! 🌅 #travel #nature",
    likes: 12500,
    comments: 342,
    shares: 89,
  },
  {
    id: "2",
    user: {
      handle: "@janesmith",
      displayName: "Jane Smith",
      avatarUrl: "https://i.pravatar.cc/150?u=janesmith",
    },
    caption: "New recipe alert! 🍕 #cooking #food",
    likes: 8900,
    comments: 156,
    shares: 234,
  },
  {
    id: "3",
    user: {
      handle: "@mikewilson",
      displayName: "Mike Wilson",
      avatarUrl: "https://i.pravatar.cc/150?u=mikewilson",
      isVerified: true,
    },
    caption: "Workout motivation 💪 #fitness #gym",
    likes: 45600,
    comments: 890,
    shares: 567,
  },
];

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

function ClipCard({ clip }: { clip: Clip }) {
  return (
    <View style={styles.clipCard}>
      {/* Video placeholder */}
      <View style={styles.videoContainer}>
        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoPlaceholderText}>▶</Text>
        </View>

        {/* Overlay info */}
        <View style={styles.overlay}>
          {/* Right side actions */}
          <View style={styles.rightActions}>
            <View style={styles.actionButton}>
              <Text style={styles.actionIcon}>♥</Text>
              <Text style={styles.actionCount}>
                {formatNumber(clip.likes)}
              </Text>
            </View>
            <View style={styles.actionButton}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionCount}>
                {formatNumber(clip.comments)}
              </Text>
            </View>
            <View style={styles.actionButton}>
              <Text style={styles.actionIcon}>↗</Text>
              <Text style={styles.actionCount}>
                {formatNumber(clip.shares)}
              </Text>
            </View>
          </View>

          {/* Bottom user info */}
          <View style={styles.bottomInfo}>
            <View style={styles.userInfo}>
              <Text style={styles.displayName}>
                {clip.user.displayName}
                {clip.user.isVerified && " ✓"}
              </Text>
              <Text style={styles.caption} numberOfLines={2}>
                {clip.caption}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Following</Text>
        <Text style={[styles.topBarTitle, styles.topBarActive]}>For You</Text>
      </View>

      {/* Feed */}
      <FlatList
        data={MOCK_CLIPS}
        renderItem={({ item }) => <ClipCard clip={item} />}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig.current}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT - insets.top - 64,
          offset: (SCREEN_HEIGHT - insets.top - 64) * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 16,
  },
  topBarTitle: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  topBarActive: {
    color: "#fff",
  },
  clipCard: {
    height: SCREEN_HEIGHT - 150,
    backgroundColor: "#111",
  },
  videoContainer: {
    flex: 1,
    position: "relative",
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholderText: {
    fontSize: 48,
    color: "#333",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 16,
  },
  rightActions: {
    position: "absolute",
    right: 16,
    bottom: 100,
    alignItems: "center",
    gap: 20,
  },
  actionButton: {
    alignItems: "center",
    gap: 4,
  },
  actionIcon: {
    fontSize: 28,
  },
  actionCount: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  bottomInfo: {
    marginBottom: 16,
  },
  userInfo: {
    gap: 4,
  },
  displayName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  caption: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
});
