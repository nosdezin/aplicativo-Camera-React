import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { FontAwesome } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [flash, setFlashLight] = useState("off");

  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const [valueZoom, setZoom] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Acesso Negado</Text>;
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
    }
  }

  function aumentarZoom() {
    setZoom(valueZoom + 0.1);
  }

  function diminuirZoom() {
    setZoom(valueZoom - 0.1);
  }

  function FlashLightFunc() {
    if (flash == "off") {
      setFlashLight("on");
    } else {
      setFlashLight("off");
    }
  }

  async function savePicture() {
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)
      .then(() => {
        console.log("Foto salva com succeso");
      })
      .catch((err) => console.log(err));
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        ref={camRef}
        zoom={valueZoom}
        flashMode={flash}
      >
        <View style={styles.contentButtons}>
          <TouchableOpacity
            style={styles.buttonFlip}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <FontAwesome name="exchange" size={23} color="red" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonCamera} onPress={takePicture}>
            <FontAwesome name="camera" size={23} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonZoomPlus}
            onPress={aumentarZoom}
          >
            <FontAwesome name="search-plus" size={23} color="#121212" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonZoomMnus}
            onPress={diminuirZoom}
          >
            <FontAwesome name="search-minus" size={23} color="#121212" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonFlashLigh}
            onPress={FlashLightFunc}
          >
            <FontAwesome name="flash" size={23} color="#121212" />
          </TouchableOpacity>
        </View>
      </Camera>
      {capturedPhoto && (
        <Modal animationType="slide" transparent={true} visible={open}>
          <View style={styles.contentModal}>
            <View style={{ flexDirection: "row", margin: 10 }}>
              <TouchableOpacity
                style={{ margin: 10 }}
                onPress={() => {
                  setOpen(false);
                }}
              >
                <FontAwesome name="close" size={50} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity style={{ margin: 10 }} onPress={savePicture}>
                <FontAwesome name="upload" size={50} color="#121212" />
              </TouchableOpacity>
            </View>

            <Image style={styles.imgPhoto} source={{ uri: capturedPhoto }} />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  contentButtons: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
  },
  buttonFlip: {
    position: "absolute",
    bottom: 50,
    left: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  buttonCamera: {
    position: "absolute",
    bottom: 50,
    right: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  contentModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
    margin: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 2,
    margin: 10,
  },
  imgPhoto: {
    width: "100%",
    height: 400,
  },
  buttonZoomPlus: {
    position: "absolute",
    bottom: 140,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  buttonZoomMnus: {
    position: "absolute",
    bottom: 210,
    left: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  buttonFlashLigh: {
    position: "absolute",
    bottom: 50,
    right: 140,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
  },
});
