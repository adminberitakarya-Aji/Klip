import { View, Text, ScrollView, TextInput, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";

const TRENDING_TAGS = [
  { tag: "#travel", posts: "2.5M" },
  { tag: "#cooking", posts: "1.8M" },
  { tag: "#fitness", posts: "3.2M" },
  { tag: "#music", posts: "4.1M" },
  { tag: "#comedy", posts: "5.6M" },
  { tag: "#tech", posts: "1.2M" },
];

const CATEGORIES = [
  { id: "1", name: "For You", emoji: "✨" },
  { id: "2", name: "Trending", emoji: "🔥" },
  { id: "3", name: "Music", emoji: "🎵" },
  { id: "4", name: "Gaming", emoji: "🎮" },
  { id: "5", name: "Sports", emoji: "⚽" },
  { id: "6", name: "Food", emoji: "🍕" },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Search color="#666" size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search clips, users, tags..."
          placeholderTextColor="#666"
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((category) => (
            <View key={category.id} style={styles.categoryChip}>
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Trending section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <View style={styles.trendingGrid}>
            {TRENDING_TAGS.map((item, index) => (
              <View key={index} style={styles.trendingItem}>
                <Text style={styles.trendingTag}>{item.tag}</Text>
                <Text style={styles.trendingPosts}>{item.posts} posts</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Featured clips placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Clips</Text>
          <View style={styles.featuredGrid}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <View key={item} style={styles.featuredItem}>
                <View style={styles.featuredPlaceholder}>
                  <Text style={styles.featuredPlaceholderText}>▶</Text>
                </View>
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredTitle} numberOfLines={1}>
                    Amazing clip #{item}
                  </Text>
                  <Text style={styles.featuredViews}>12.5K views</Text>
                </View>
              </View>
            ))}
          </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  trendingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  trendingItem: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: "48%",
  },
  trendingTag: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  trendingPosts: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
  },
  featuredGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  featuredItem: {
    width: "48%",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    overflow: "hidden",
  },
  featuredPlaceholder: {
    aspectRatio: 9 / 12,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredPlaceholderText: {
    fontSize: 32,
    color: "#333",
  },
  featuredInfo: {
    padding: 8,
  },
  featuredTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  featuredViews: {
    color: "#666",
    fontSize: 12,
    marginTop: 2,
  },
});
