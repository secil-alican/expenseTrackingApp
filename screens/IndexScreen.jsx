import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import NumberFormat from 'react-number-format';

export default function IndexScreen() {
  const [money, setMoney] = useState("");


  return (
    <View style={styles.container}>
      <View style={styles.money}>
        <Text style={styles.moneyText}>Aylık Gelir</Text>
        <View style={styles.inputMoney}>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            value={money}
            onChangeText={(value)=>setMoney(value)}
            placeholder="Gelirinizi Girin"
            placeholderTextColor="#8e8e8e"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  money: {
    backgroundColor: "#F4D793",
    borderRadius: 12,
    padding: 25,
    marginVertical: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  moneyText: {
    textAlign: "center",
    fontSize: 22,
    marginBottom: 15,
    color: "#333",
  },
  textInput: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 18,
  },
  inputMoney: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  currencyText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
});
