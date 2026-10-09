import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />

      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Your Favorite Places",
          }}
        />

        <Stack.Screen
          name="add-place"
          options={{
            title: "Add a New Place",
          }}
        />

        <Stack.Screen
          name="map"
          options={{
            title: "Map",
          }}
        />

        <Stack.Screen
          name="place-details"
          options={{
            title: "Place Details",
          }}
        />
      </Stack>
    </>
  );
}
