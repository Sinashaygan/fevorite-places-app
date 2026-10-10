import IconButton from "@/components/ui/IconButton";
import { COLORS } from "@/constants/colors";
import { PlacesProvider } from "@/context/PlacesContext";
import { init } from "@/utils/database";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import AppLoading from "expo-app-loading";

export default function RootLayout() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    init()
      .then(() => setDbInitialized(true))
      .catch((err) => console.log(err));
  }, []);

  if (!dbInitialized) {
    <AppLoading />;
  }
  return (
    <>
      <StatusBar style="light" />

      <PlacesProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: COLORS.primary500 },
            headerTintColor: COLORS.primary50,
            headerShadowVisible: false,
            contentStyle: { backgroundColor: COLORS.gray700 },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "Your Favorite Places",
              headerShadowVisible: false,
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon="add"
                  size={24}
                  color={tintColor}
                  onPress={() => router.push("/add-place")}
                />
              ),
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
      </PlacesProvider>
    </>
  );
}
