import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [isLogin, setIsLogin] = useState(true);

  return <AuthForm isLogin={isLogin} />;
}

const styles = StyleSheet.create({});
