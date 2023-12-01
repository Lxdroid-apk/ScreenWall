import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import Modal from 'react-native-modal';
import Loader from './component/Loader';
import { loadUnsplaceWall } from './assets/api';
import { setWall } from 'rn-set-wallpaper'; // Make sure this import is correct

const { height, width } = Dimensions.get('window');

const App = () => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const loadWallpapers = async () => {
    try {
      const data = await loadUnsplaceWall();
      setImages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading wallpapers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallpapers();
  }, []);

  

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{ height: 200, width: width / 2, margin: 5 }}
      onPress={() => setSelectedImage(item.imageUrl)}
    >
      <Image
        style={{ flex: 1, borderRadius: 10 }}
        source={{ uri: item.imageUrl }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
  
  const setUsWallpaper = async () => {
    try {
      if (selectedImage && selectedImage.item && selectedImage.item.imageUrl) {
        const imageUrl = selectedImage.item.imageUrl;
        await setWall({ uri: imageUrl });
        console.log('Wallpaper set successfully!');
      } else {
        console.error('No image selected to set as wallpaper.');
      }
    } catch (error) {
      console.error('Error setting wallpaper:', error);
    }
  };
  
  
  const ImageViewer = ({ visible, imageUri, onClose }) => (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.setusScreen} onPress={setUsWallpaper}>
          <Text style={styles.setusScreenText}>SetUsScreen</Text>
        </TouchableOpacity>

        <Image style={styles.fullImage} source={{ uri: imageUri }} resizeMode="contain" />
      </View>
    </Modal>
  );

  
 

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View style={styles.loader}>
          <Loader />
        </View>
      ) : (
        <>
          <FlatList
            data={images}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
          />
          <ImageViewer
            visible={!!selectedImage}
            imageUri={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 2,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  setusScreen: {
    position: 'absolute',
    bottom: 20,
    marginHorizontal: 20,
    zIndex: 2,
  },
  setusScreenText: {
    color: 'white',
    fontSize: 16,
  },

  fullImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default App;
