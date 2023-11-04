import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import tw from "../../../utils/tailwind";

export default function Onboarding() {
  return (
    <>
      <Link href="/home">
        <View style={tw`w-100 h-100 bg-accent`} />
        <View style={tw`w-100 h-100 bg-accent`} />
        <View style={tw`w-100 h-100 bg-accent`} />
      </Link>
    </>
  );
}
