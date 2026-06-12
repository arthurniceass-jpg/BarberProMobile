import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export function useCamera() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const pickImage = async () => {
    Alert.alert(
      'Foto de Perfil',
      'Escolha uma opção',
      [
        {
          text: 'Câmera',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Erro', 'Permissão da câmera é necessária.');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled) {
              setPhotoUri(result.assets[0].uri);
            }
          },
        },
        {
          text: 'Galeria',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Erro', 'Permissão da galeria é necessária.');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled) {
              setPhotoUri(result.assets[0].uri);
            }
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  return { photoUri, setPhotoUri, pickImage };
}
