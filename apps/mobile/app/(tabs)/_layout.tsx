import { Tabs } from "expo-router";
import { View, Platform } from "react-native";
import { Home, Search, PlusSquare, MessageCircle, User } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

function TabBarIcon({
  icon: Icon,
  color,
  size,
}: {
  icon: LucideIcon;
  color: string;
  size: number;
}) {
  return <Icon color={color} size={size} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <TabBarIcon icon={Home} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <TabBarIcon icon={Search} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 8,
                width: 44,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlusSquare color="#000" size={20} />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <TabBarIcon icon={MessageCircle} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <TabBarIcon icon={User} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
