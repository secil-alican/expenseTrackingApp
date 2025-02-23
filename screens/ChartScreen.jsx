import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { PieChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dimensions } from "react-native";
import ProgressBar from "react-native-progress/Bar";
import Svg, { Circle, Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function ChartScreen() {
  const [expenses, setExpenses] = useState([]);
  const screenWidth = Dimensions.get("window").width;
  const [money, setMoney] = useState("");
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    if (progress > 0) {
      animatedProgress.value = withTiming(progress, { duration: 1000 });
    } else {
      animatedProgress.value = withTiming(0, { duration: 1000 });
    }
  }, [progress, expenses, money]);

  const sum = (expenses || []).reduce(
    (acc, expense) => acc + expense.expenseMoney,
    0
  );

  const progress = money > 0 ? (money - sum) / money : 0;

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



  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.progressContainer}>
          <Text style={styles.remainingMoneyText}>
            Kalan Para: <Text style={styles.moneyValue}>{money - sum} ₺</Text>
          </Text>
          <Svg width={200} height={120} viewBox="0 0 200 100">
            <Circle
              cx="100"
              cy="100"
              r="80"
              stroke="#E0E0E0"
              strokeWidth="25"
              fill="none"
              strokeDasharray="10,10"
            />
            <AnimatedPath
              stroke="#4CAF50"
              strokeWidth="25"
              fill="none"
              strokeDasharray={Math.PI * 80}
              animatedProps={useAnimatedProps(() => ({
                strokeDashoffset: Math.PI * 80 * (1 - animatedProgress.value),
              }))}
              d="M 20,100 A 80,80 0 1,1 180,100"
            />
          </Svg>
          <Text style={styles.progressText}>
            {((progress || 0) * 100).toFixed(0)}%
          </Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <PieChart
            data={chartData}
            width={screenWidth}
            height={300}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 30]}
            absolute={false}
          />
        </View>
        <View style={styles.legendContainer}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[styles.colorBox, { backgroundColor: item.color }]}
              />
              <Text>{item.name}</Text>
              <Text>{item.population} ₺</Text>
            </View>
          ))}
        </View>
        <View style={styles.resetView}>
          <Pressable
            style={({ pressed }) => pressed && styles.pressed}

          >
            <View style={styles.resetButton}>
              <Text style={{ fontSize: 15 }}>Takibi Sıfırla</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
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
  },

  pressed: {
    opacity: 0.5,
  },
  resetView: {
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

  text: {
    fontSize: 15,
    fontWeight: "500",
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
  legendContainer: {
    marginVertical: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingHorizontal: 10,
  },
  progressContainer: {
    marginVertical: 20,
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#F4F4F4",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  remainingMoneyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  moneyValue: {
    fontWeight: "bold",
  },
  progressText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
});
