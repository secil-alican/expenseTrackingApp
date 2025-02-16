import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import IndexSceen from "./IndexScreen";
import ChartScreen from "./ChartScreen";
import AntDesign from "@expo/vector-icons/AntDesign";


const Tab = createBottomTabNavigator();

export default function TabBarScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black",
        tabBarActiveBackgroundColor: "#889E73",
      }}
    >
      <Tab.Screen
        name="IndexScreen"
        component={IndexSceen}
        options={{
          title: "Anasayfa",
          tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
        }}
      />

      <Tab.Screen
        name="ChartScreen"
        component={ChartScreen}
        options={{
          title: "Grafik",
          tabBarIcon: () => (
            <AntDesign name="barschart" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
