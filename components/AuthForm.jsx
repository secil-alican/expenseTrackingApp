import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function AuthForm({ isLogin }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validEmail = email.includes("@");

  const storeData = async ({ email, password }) => {
    try {
      const userData = { email, password };
      const jsonValue = JSON.stringify(userData);
      await AsyncStorage.setItem("users", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("users");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log(e);
    }
    getData().then((data) => console.log(data));
  };

  const signUpHandler = async () => {
    if (validEmail) {
      await storeData({ email, password });
      const data = await getData();
      console.log("User Signed Up:", data);
      navigation.navigate("TabBarScreen");
      setEmail("");
      setPassword("");
    } else {
      alert("invalid e-mail");
    }
  };

  const loginHandler = async () => {
    const userData = await getData();
    if (
      userData &&
      userData.email === email &&
      userData.password === password
    ) {
      console.log("Login successful:", userData);
      alert("Login successful!");
      navigation.navigate("TabBarScreen");
      setEmail("");
      setPassword("");
    } else {
      console.log("Login failed: Incorrect email or password");
      alert("Incorrect email or password!");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/authBack.jpeg")}
      style={{ flex: 1, resizeMode: "cover" }}
    >
      <View style={styles.container}>
        <View style={styles.formView}>
          <Text style={styles.title}>{isLogin ? "LOGIN" : "SIGN UP"}</Text>
          <TextInput
            placeholder="E-Mail"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={(value) => setEmail(value)}
            keyboardType="email-address"
            style={styles.textInput}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={(value) => setPassword(value)}
            secureTextEntry={true}
            style={styles.textInput}
          />
          <Pressable
            style={styles.Button}
            onPress={isLogin ? loginHandler : signUpHandler}
          >
            <Text style={styles.buttonText}>
              {isLogin ? "LOGIN" : "SIGN UP"}
            </Text>
          </Pressable>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "center",
              marginVertical: 20,
            }}
          >
            <Text>
              {" "}
              {isLogin ? "Don't have an acoount ?" : "Do you have an account ?"}
            </Text>
            <Pressable
              style={({ pressed }) => pressed && styles.pressed}
              onPress={() =>
                navigation.navigate(isLogin ? "SignUpScreen" : "LoginScreen")
              }
            >
              <Text
                style={{
                  color: "#A94A4A",
                  textDecorationLine: "underline",
                }}
              >
                {isLogin ? "Sign Up" : "Login"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formView: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 120,
  },
  pressed: {
    opacity: 0.5,
  },
  textInput: {
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    color: "#000",
  },
  Button: {
    backgroundColor: "#A94A4A",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#A94A4A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 50,
    textAlign: "center",
    color: "#A94A4A",
    marginVertical: 20,
  },
});
