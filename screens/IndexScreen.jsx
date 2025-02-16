import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Modal,
  Button,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Expenses from "../components/Expenses";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function IndexScreen() {
  const [money, setMoney] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState();
  const [expenseMoney, setExpenseMoney] = useState(0);
  const [expenses, setExpenses] = useState([]);

  function addExpense() {
    if (expenseMoney && selectedCategory) {
      setIsModal(false);
      setSelectedCategory();
      setExpenseMoney(0);

      const newExpense = {
        id: Math.floor(Math.random() * 10000),
        category: selectedCategory,
        expenseMoney: parseFloat(expenseMoney),
      };

      setExpenses((prevExpenses) => {
        const updatedExpenses = [newExpense, ...prevExpenses];
        storeData(updatedExpenses);
        return updatedExpenses;
      });

      console.log(selectedCategory);
      console.log(expenseMoney);
    } else {
      Alert.alert("Lütfen değerleri giriniz !");
    }
  }

  function closeModal() {
    setIsModal(false);
    setSelectedCategory();
    setExpenseMoney("");
  }

  function deleteExpense(id) {
    setExpenses((prevExpenses) => {
      const updateExpenses = prevExpenses.filter(
        (expense) => expense.id !== id
      );
      storeData(updateExpenses);
      return updateExpenses;
    });
  }

  const storeData = async (expenses, money) => {
    try {
      const jsonValue = JSON.stringify(expenses, money);
      await AsyncStorage.setItem("expenses", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("expenses");
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  useEffect(() => {
    const loadExpenses = async () => {
      const data = await getData();
      setExpenses(data);
    };
    loadExpenses();
  }, []);

  const storeMoney = async (money) => {
    try {
      await AsyncStorage.setItem("money", JSON.stringify(money));
    } catch (e) {
      console.log(e);
    }
  };

  const getMoney = async () => {
    try {
      const value = await AsyncStorage.getItem("money");
      return value !== null ? JSON.parse(value) : "0";
    } catch (e) {
      console.log(e);
      return "0";
    }
  };


  useEffect(() => {
    const loadMoney = async () => {
      const data = await getMoney();
      setMoney(data);
    };
    loadMoney();
  }, []);


  useEffect(() => {
    if (money) {
      storeMoney(money);
    }
  }, [money]);

  return (
    <View style={styles.container}>
      <View style={styles.money}>
        <Text style={{ fontSize: 20 }}>AYLIK GELİR</Text>
        <View style={styles.inputMoney}>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            value={money}
            onChangeText={(value) => setMoney(value)}
            placeholder="Gelirinizi Girin"
            placeholderTextColor="#8e8e8e"
          />
          <Text style={{ fontSize: 25 }}>₺</Text>
        </View>
      </View>
      <View style={styles.expensesView}>
        <View style={styles.expensesAndIcon}>
          <Text style={styles.expensesTitle}>HARCAMALAR</Text>
          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={() => setIsModal(true)}
          >
            <View style={styles.plusIcon}>
              <Fontisto name="plus-a" size={25} color="black" />
            </View>
          </Pressable>
        </View>
      </View>
      <Modal visible={isModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <View style={styles.modalView}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                KATEGORİ :
              </Text>
              <View style={styles.pickerView}>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                >
                  <Picker.Item label="Seçiniz" value="" />
                  <Picker.Item label="Alışveriş" value="Alışveriş" />
                  <Picker.Item label="Yeme-İçme" value="Yeme-İçme" />
                  <Picker.Item label="Kira" value="Kira" />
                  <Picker.Item label="Fatura" value="Fatura" />
                  <Picker.Item label="Market-Gıda" value="Market-Gıda" />
                  <Picker.Item label="Ulaşım" value="Ulaşım" />
                  <Picker.Item label="Sağlık" value="Sağlık" />
                  <Picker.Item label="Eğitim" value="Eğitim" />
                  <Picker.Item
                    label="Vergiler-Sigorta"
                    value="Vergiler-Sigorta"
                  />
                  <Picker.Item label="Kişisel Bakım" value="Kişisel Bakım" />
                  <Picker.Item label="Eğlence" value="Eğlence" />
                  <Picker.Item
                    label="Seyahat ve Tatil"
                    value="Seyahat ve Tatil"
                  />
                </Picker>
              </View>
            </View>
            <View>
              <TextInput
                placeholder="Harcama Miktarını Yazın"
                style={styles.textInput}
                keyboardType="numeric"
                value={expenseMoney}
                onChangeText={(value) => setExpenseMoney(value)}
                placeholderTextColor="#8e8e8e"
              />
            </View>
            <Pressable
              onPress={() => addExpense()}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <View style={styles.closeButton}>
                <Text
                  style={{ textAlign: "center", color: "#fff", fontSize: 15 }}
                >
                  EKLE
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => closeModal()}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <View style={styles.plusButton}>
                <Text
                  style={{ textAlign: "center", color: "#fff", fontSize: 15 }}
                >
                  VAZGEÇ
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </Modal>
      {expenses && (
        <Expenses
          expenses={expenses}
          money={money}
          deleteExpense={deleteExpense}
        />
      )}
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
    padding: 40,
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
    borderWidth: 2,
    borderColor: "#A94A4A",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 18,
    marginVertical: 20,
  },
  inputMoney: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 10,
  },
  currencyText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  expensesTitle: {
    fontSize: 20,
  },
  expensesAndIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plusIcon: {
    padding: 10,
    backgroundColor: "#889E73",
    borderRadius: 10,
  },
  pressed: {
    opacity: 0.5,
  },
  plusButton: {
    backgroundColor: "#889E73",
    padding: 8,
    borderRadius: 10,
    textAlign: "center",
  },
  pickerView: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: "#A94A4A",
    padding: 8,
    borderRadius: 10,
    textAlign: "center",
    marginVertical: 20,
  },
});
