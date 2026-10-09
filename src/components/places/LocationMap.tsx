import { COLORS } from "@/constants/colors";
import type { PlaceLocation } from "@/types/place";
import { isValidPlaceLocation } from "@/utils/location";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type {
  WebViewMessageEvent,
  WebViewNavigation,
} from "react-native-webview";
import { WebView } from "react-native-webview";

type LocationMapProps = {
  location: PlaceLocation;
};

type MapMessage =
  | { type: "map-ready" }
  | { type: "map-error"; message: string; failedTiles?: number };

const MAP_LOAD_TIMEOUT_MS = 15_000;

const MAP_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <style>
      html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; background: #dbeafe; }
      .place-marker {
        width: 22px;
        height: 22px;
        border: 4px solid #ffffff;
        border-radius: 50%;
        background: #1aacf0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
      }
      .leaflet-control-attribution { font-size: 10px; }
    </style>
  </head>
  <body>
    <div id="map" role="application" aria-label="Selected location map"></div>
    <script>
      (function () {
        var map = null;
        var marker = null;
        var pendingLocation = null;
        var tileErrorCount = 0;
        var tileErrorTimer = null;
        var hasReportedReady = false;
        var hasReportedTileError = false;

        function post(message) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(message));
          }
        }

        function isValidCoordinate(latitude, longitude) {
          return Number.isFinite(latitude) &&
            Number.isFinite(longitude) &&
            latitude >= -90 && latitude <= 90 &&
            longitude >= -180 && longitude <= 180;
        }

        function applyLocation(latitude, longitude) {
          if (!map || !isValidCoordinate(latitude, longitude)) {
            return;
          }

          map.setView([latitude, longitude], 15, { animate: false });

          if (marker) {
            marker.setLatLng([latitude, longitude]);
          } else {
            marker = L.marker([latitude, longitude], {
              icon: L.divIcon({
                className: "",
                html: '<div class="place-marker" aria-label="Current location"></div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              })
            }).addTo(map);
          }
        }

        window.updateLocation = function (latitude, longitude) {
          if (!isValidCoordinate(latitude, longitude)) {
            post({ type: "map-error", message: "Invalid coordinates were provided to the map." });
            return;
          }

          pendingLocation = { latitude: latitude, longitude: longitude };
          applyLocation(latitude, longitude);
        };

        function initializeMap() {
          try {
            map = L.map("map", {
              attributionControl: true,
              dragging: true,
              scrollWheelZoom: true,
              touchZoom: true,
              zoomControl: true
            }).setView([0, 0], 2);

            var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
              maxZoom: 19
            });

            tiles.on("load", function () {
              if (!hasReportedReady) {
                hasReportedReady = true;
                post({ type: "map-ready" });
              }
            });

            tiles.on("tileerror", function () {
              tileErrorCount += 1;
              clearTimeout(tileErrorTimer);
              tileErrorTimer = setTimeout(function () {
                if (!hasReportedTileError) {
                  hasReportedTileError = true;
                  post({
                    type: "map-error",
                    message: "OpenStreetMap tiles could not be loaded. Check your internet connection.",
                    failedTiles: tileErrorCount
                  });
                }
              }, 1200);
            });

            if (pendingLocation) {
              applyLocation(pendingLocation.latitude, pendingLocation.longitude);
            }

            tiles.addTo(map);
          } catch (error) {
            post({
              type: "map-error",
              message: error instanceof Error ? error.message : "Leaflet could not initialize."
            });
          }
        }

        var stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        stylesheet.onerror = function () {
          post({ type: "map-error", message: "Leaflet styles could not be downloaded." });
        };
        document.head.appendChild(stylesheet);

        var script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = initializeMap;
        script.onerror = function () {
          post({ type: "map-error", message: "Leaflet could not be downloaded." });
        };
        document.head.appendChild(script);
      })();
    </script>
  </body>
</html>`;

const MAP_SOURCE = { html: MAP_HTML } as const;

function isMapMessage(value: unknown): value is MapMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (candidate.type === "map-ready") {
    return true;
  }

  return (
    candidate.type === "map-error" &&
    typeof candidate.message === "string" &&
    (candidate.failedTiles === undefined ||
      (typeof candidate.failedTiles === "number" &&
        Number.isFinite(candidate.failedTiles)))
  );
}

export default function LocationMap({ location }: LocationMapProps) {
  const webViewRef = useRef<WebView>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [mapError, setMapError] = useState<string | null>(null);

  const sendLocationToMap = useCallback(() => {
    if (!isValidPlaceLocation(location)) {
      setMapStatus("error");
      setMapError("The selected coordinates are invalid.");
      return;
    }

    const latitude = JSON.stringify(location.latitude);
    const longitude = JSON.stringify(location.longitude);
    webViewRef.current?.injectJavaScript(`
      window.updateLocation(${latitude}, ${longitude});
      true;
    `);
  }, [location]);

  useEffect(() => {
    sendLocationToMap();
  }, [retryKey, sendLocationToMap]);

  useEffect(() => {
    if (mapStatus !== "loading") {
      return;
    }

    const timer = setTimeout(() => {
      setMapStatus("error");
      setMapError(
        "The map took too long to load. Check your internet connection and try again.",
      );
    }, MAP_LOAD_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [mapStatus, retryKey]);

  function handleMessage(event: WebViewMessageEvent) {
    try {
      const parsedMessage: unknown = JSON.parse(event.nativeEvent.data);

      if (!isMapMessage(parsedMessage)) {
        return;
      }

      if (parsedMessage.type === "map-ready") {
        setMapStatus("ready");
        setMapError(null);
        sendLocationToMap();
        return;
      }

      setMapStatus("error");
      setMapError(parsedMessage.message);
    } catch {
      setMapStatus("error");
      setMapError("The map returned an unreadable response.");
    }
  }

  function handleRetry() {
    setMapStatus("loading");
    setMapError(null);
    setRetryKey((currentKey) => currentKey + 1);
  }

  function handleNavigationRequest(request: WebViewNavigation) {
    if (
      request.url.startsWith("http://") ||
      request.url.startsWith("https://")
    ) {
      void Linking.openURL(request.url);
      return false;
    }

    return true;
  }

  if (!isValidPlaceLocation(location)) {
    return (
      <View style={styles.feedbackContainer}>
        <Text style={styles.errorText}>
          The selected coordinates are invalid.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        key={retryKey}
        ref={webViewRef}
        javaScriptEnabled
        onError={() => {
          setMapStatus("error");
          setMapError("The map view could not be loaded.");
        }}
        onHttpError={() => {
          setMapStatus("error");
          setMapError("A map resource could not be downloaded.");
        }}
        onLoadEnd={sendLocationToMap}
        onMessage={handleMessage}
        onShouldStartLoadWithRequest={handleNavigationRequest}
        originWhitelist={["*"]}
        source={MAP_SOURCE}
        style={styles.webView}
      />

      {mapStatus === "loading" && (
        <View style={styles.overlay}>
          <ActivityIndicator color={COLORS.primary500} size="large" />
          <Text style={styles.loadingText}>Loading map…</Text>
        </View>
      )}

      {mapStatus === "error" && (
        <View style={styles.overlay}>
          <Text style={styles.errorText}>{mapError}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleRetry}
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.retryButtonPressed,
            ]}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 260,
    overflow: "hidden",
    borderRadius: 10,
    backgroundColor: COLORS.primary100,
  },
  webView: {
    flex: 1,
    backgroundColor: COLORS.primary100,
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(207, 239, 253, 0.94)",
    padding: 20,
  },
  feedbackContainer: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: COLORS.primary100,
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.gray700,
  },
  errorText: {
    color: COLORS.gray700,
    lineHeight: 20,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: COLORS.primary500,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  retryButtonPressed: {
    opacity: 0.7,
  },
  retryButtonText: {
    color: COLORS.primary500,
    fontWeight: "700",
  },
});
