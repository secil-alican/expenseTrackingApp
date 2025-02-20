import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Expenses({ expenses, money, deleteExpense }) {

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <AntDesign name="arrowdown" size={24} color="#A94A4A" />
            <Text style={styles.text}>{item.category}</Text>
            <Text style={styles.text}>{item.expenseMoney} ₺</Text>
            <Pressable
              style={({ pressed }) => pressed && styles.pressed}
              onPress={() => deleteExpense(item.id)}
            >
              <AntDesign name="delete" size={24} color="black" />
            </Pressable>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
    borderWidth: 1,
    padding: 20,
    borderRadius: 10,
    borderColor: "#A94A4A",
    backgroundColor: "#FFF6DA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  text: {
    fontSize: 15,
  },
  pressed: {
    opacity: 0.5,
  },

});
