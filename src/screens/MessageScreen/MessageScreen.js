import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, TextInput, Button, FlatList, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { fetchMessageById, fetchRepliesByMessage, createMessage } from '../../redux/actions/actionMessage';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
const MessageComponent = () => {
  const dispatch = useDispatch();
  const { userMessages, messageReplies, isLoading, error } = useSelector(state => state.messageReplies);

  const [messageContent, setMessageContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    dispatch(fetchMessageById());
  }, [dispatch]);

  useEffect(() => {
    userMessages.forEach(message => {
      if (message._id) {
        dispatch(fetchRepliesByMessage(message._id));
      }
    });
  }, [userMessages, dispatch]);

  const handleSelectImage = () => {
    const options = { mediaType: 'photo', quality: 1, selectionLimit: 5 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image selection');
      } else if (response.error) {
        console.log('Image selection error: ', response.error);
      } else {
        setSelectedImages(response.assets.map(asset => asset.uri));
        console.log('Selected images:', response.assets.map(asset => asset.uri));
      }
    });
  };

  const handleSendMessage = async () => {
    if (messageContent.trim() || selectedImages.length > 0) {
      try {
        const base64Images = await Promise.all(
          selectedImages.map(async (uri) => {
            // Nén hình ảnh
            const resizedImage = await ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 80);
            const base64 = await RNFS.readFile(resizedImage.uri, 'base64');
            return `data:image/jpeg;base64,${base64}`;
          })
        );
  
        const messageData = {
          content: messageContent.trim() || ' ',
          images: base64Images,
        };
  
        await dispatch(createMessage(messageData));
        setMessageContent('');
        setSelectedImages([]);
      } catch (error) {
        console.error('Error sending message:', error);
        alert('An error occurred while sending the message.');
      }
    } else {
      alert('Please enter a message or select images to send.');
    }
  };
  const handleImagePress = (imageUri) => {
    setSelectedImage(imageUri);
    setIsModalVisible(true);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View style={styles.container}>
<FlatList
  data={userMessages}
  keyExtractor={item => item._id ? item._id.toString() : Math.random().toString()}
  renderItem={({ item }) => (
    <View>
      <View style={[styles.messageContainer, item.isSentByUser ? styles.userMessage : styles.receivedMessage]}>
        <Text style={styles.message}>{item.content}</Text>
        {item.img && item.img.length > 0 && item.img.map((img, index) => (
          <TouchableOpacity key={index} onPress={() => handleImagePress(img)}>
            <Image source={{ uri: img }} style={styles.sentImage} onError={() => console.log('Image failed to load:', img)} />
          </TouchableOpacity>
        ))}
        <Text style={styles.timestamp}>{formatDate(item.createdAt)}</Text>
      </View>
      {messageReplies[item._id]?.length > 0 && (
        <View style={styles.repliesContainer}>
          {messageReplies[item._id].map(reply => (
            <View key={reply._id} style={styles.replyContainer}>
              <Text style={styles.reply}>{reply.content}</Text>
              {reply.img && reply.img.length > 0 && reply.img.map((img, index) => (
                <TouchableOpacity key={index} onPress={() => handleImagePress(img)}>
                  <Image source={{ uri: img }} style={styles.sentImage} onError={() => console.log('Image failed to load:', img)} />
                </TouchableOpacity>
              ))}
              <Text style={styles.timestamp}>{formatDate(reply.createdAt)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )}
/>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập  nội dung tin nhắn..."
          value={messageContent}
          onChangeText={setMessageContent}
        />
        <TouchableOpacity onPress={handleSelectImage}>
          <Image
            source={{ uri: 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-camera-icon-png-image_696326.jpg' }}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
        <Button title="Gửi" onPress={handleSendMessage} />
      </View>

      <View style={styles.imagePreviewContainer}>
        {selectedImages.map((img, index) => (
          <Image key={index} source={{ uri: img }} style={styles.selectedImage} />
        ))}
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalContainer} onPress={() => setIsModalVisible(false)}>
          <Image source={{ uri: selectedImage }} style={styles.modalImage} />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  messageContainer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    maxWidth: '80%',
    backgroundColor: '#e7e7e7',
  },
  userMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#d1f7c4',
  },
  receivedMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1f7c4',
  },
  message: {
    fontSize: 16,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  repliesContainer: {
    marginTop: 5,
    marginLeft: 10,
  },
  replyContainer: {
    padding: 5,
    borderRadius: 5,
    marginVertical: 2,
    maxWidth: '70%',
    alignSelf: 'flex-start',
    backgroundColor: '#e0f7fa',
  },
  reply: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  selectedImage: {
    width: 50,
    height: 50,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 5,
  },
  sentImage: {
    width: 100,
    height: 100,
    marginTop: 5,
    borderRadius: 5,
  },
  cameraIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default MessageComponent;