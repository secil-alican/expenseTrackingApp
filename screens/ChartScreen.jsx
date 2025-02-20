import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { PieChart, BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";

export default function ChartScreen() {
  const [expenses, setExpenses] = useState([]);
  const screenWidth = Dimensions.get("window").width;
  const [money, setMoney] = useState("");
  const [mostExpense, setMostExpense] = useState("");
  const [lessExpense, setLessExpense] = useState("");

  const sum = (expenses || []).reduce(
    (acc, expense) => acc + expense.expenseMoney,
    0
  );

  const chartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
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
  }, [expenses]);

  const colorMap = {
    Alışveriş: "#A94A4A",
    "Yeme-İçme": "#F4D793",
    Kira: "#FFF6DA",
    Fatura: "#754E1A",
    "Market-Gıda": "#A64D79",
    Ulaşım: "#6A1E55",
    Sağlık: "#3E5879",
    " Vergiler-Sigorta": "#FF69B4",
    "Kişisel Bakım": "#FFAB5B",
    Eğlence: "#AA60C8",
    "Seyahat ve Eğlence": "#3D8D7A",
    Eğitim: "#DE3163",
  };

  const getCategoryColor = (category) => {
    return colorMap[category] || "#CCCCCC";
  };

  const chartData = expenses.map((expense) => ({
    name: expense.category,
    population: expense.expenseMoney,
    color: getCategoryColor(expense.category),
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

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
    const maxExpense = expenses.reduce(
      (max, expense) => {
        return expense.expenseMoney > max.expenseMoney ? expense : max;
      },
      { expenseMoney: 0 }
    );

    setMostExpense(maxExpense);
  }, [expenses]);

  useEffect(() => {
    const minExpense = expenses.reduce(
      (min, expense) => {
        return expense.expenseMoney < min.expenseMoney ? expense : min;
      },
      { expenseMoney: Infinity }
    );

    setLessExpense(minExpense);
  }, [expenses]);

  return (
    <View style={styles.container}>
      <View style={styles.currentMoneyView}>
        <Text style={{ fontSize: 15 }}>KALAN PARA</Text>
        <Text style={{ fontSize: 20 }}>{money - sum} ₺</Text>
      </View>
      <View>
        <PieChart
          data={chartData}
          width={screenWidth}
          height={300}
          chartConfig={chartConfig}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          center={[10, 30]}
          absolute
        />
      </View>
      <View style={styles.evaluationView}>
        <View style={styles.evaluationItems}>
          <Text style={styles.text}>En Çok Harcama</Text>
          <View style={styles.evaluationItem}>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              {mostExpense.category}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              {mostExpense.expenseMoney} ₺
            </Text>
          </View>
        </View>
        <View style={styles.evaluationItems}>
          <Text style={styles.text}>En Az Harcama</Text>
          <View style={styles.evaluationItem}>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              {lessExpense.category}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              {lessExpense.expenseMoney} ₺
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.resetView}>
        <Pressable style={({ pressed }) => pressed && styles.pressed}>
          <View style={styles.resetButton}>
            <Text style={{ fontSize: 15 }}>Takibi Sıfırla</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  currentMoneyView: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#F4D793",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  container: {
    marginHorizontal: 20,
    marginVertical: 20,
    flex: 1,
  },

  pressed: {
    opacity: 0.5,
  },
  resetView: {
    position: "absolute",
    bottom: 0,
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  resetButton: {
    backgroundColor: "#F4D793",
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 140,
  },
  evaluationView: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 50,
    marginVertical: 50,

  },
  text: {
    fontSize: 15,
    fontWeight: "500",
  },
  evaluationItem: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 20,
  },
  evaluationItems: {
    borderWidth: 1,
    borderColor: "#fff",
    gap: 20,
    borderRadius: 10,
    padding: 20,
    backgroundColor:"#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});
