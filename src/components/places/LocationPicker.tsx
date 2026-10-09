import { StyleSheet, View } from "react-native";
import OutlinedButton from "../ui/OutlinedButton";
import { COLORS } from "@/constants/colors";

function LocationPicker() {
  function getLocationHandler() {}

  function pickOnMapHandler() {}

  return (
    <View>
      <View style={styles.mapPreview}></View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: COLORS.primary100,
    borderRadius: 10,
  },

  actions:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  }
});
