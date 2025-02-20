import { Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarButton: (props) => (
        <Pressable {...props} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', height: 70 }}>
          <Text style={{ fontSize: 18, color: props.accessibilityState?.selected ? '#007AFF' : '#8E8E93' }}>
            {props.children}
          </Text>
        </Pressable>
      ),
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
} 