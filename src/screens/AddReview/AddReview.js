import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import { addProductReview } from '../../redux/actions/actionsReview'; // Hành động để thêm đánh giá
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchProductById, fetchProductReviews } from '../../redux/actions/actionProduct';

const AddReview = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { productId, color, size, imageVariant } = route.params; // Nhận tất cả thông tin từ route.params

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else {
        const newImages = response.assets.map(asset => ({ uri: asset.uri }));
        setSelectedImages(prevImages => [...prevImages, ...newImages]);
      }
    });
  };

  const handleSubmitReview = async () => {
    if (!rating) {
      alert('Vui lòng chọn điểm đánh giá!');
      return;
    }
  
    try {
      // Upload từng ảnh và lấy các URL trả về từ backend
    
  console.log(productId);
  
   
      const formData = new FormData();
      formData.append('product_id', productId._id);
      formData.append('rating', rating);
      formData.append('comment', comment);
      formData.append('color', color);
      formData.append('size', size);
      formData.append('image_variant', imageVariant);
  
      // Thêm từng ảnh vào FormData
      selectedImages.forEach((image, index) => {
        console.log(image);
        
        formData.append('imageUrls', {
          uri: image.uri,
          type: 'image/jpeg', // hoặc image/png, image/jpg
          name: `image_${index}.jpg`,
        });
      });

      
  
  
      // Gửi đánh giá lên server
      await dispatch(addProductReview(formData))
        .unwrap()
        .then(() => {
          alert('Đánh giá đã được thêm thành công!');
          dispatch(fetchProductReviews(productId));
          navigation.goBack(); // Quay lại màn hình trước
        })
        .catch(error => {
          console.error('Error adding review:', error);
          alert('Lỗi khi thêm đánh giá, vui lòng thử lại.');
        });

       
  
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Lỗi khi upload ảnh, vui lòng thử lại.');
    }
  };
  
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <MaterialCommunityIcons
            name={i <= rating ? 'star' : 'star-outline'}
            size={30}
            color={i <= rating ? '#FFD700' : '#ccc'}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  return (
    <ScrollView style={styles.container}>

      {/* Hiển thị thông tin sản phẩm */}
      <View style={styles.productInfoContainer}>
        <Image source={{ uri: imageVariant }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productText}>Màu sắc: {color}</Text>
          <Text style={styles.productText}>Kích cỡ: {size}</Text>
        </View>
      </View>

      {/* Chọn số sao đánh giá */}
      <Text style={styles.ratingTitle}>Chọn điểm đánh giá:</Text>
      {renderStars()}

      {/* Nhập bình luận */}
      <TextInput
        style={[styles.input, styles.commentInput]}
        placeholder="Nhập bình luận của bạn"
        multiline
        value={comment}
        onChangeText={setComment}
      />

      {/* Chọn ảnh */}
      <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
        <Text style={styles.imagePickerText}>Chọn ảnh (tùy chọn)</Text>
      </TouchableOpacity>
      <View style={styles.selectedImagesContainer}>
        {selectedImages.map((image, index) => (
          <Image key={index} source={image} style={styles.selectedImage} />
        ))}
      </View>

      {/* Nút gửi đánh giá */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
        <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  productInfoContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
  },
  productText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  commentInput: {
    height: 80,
  },
  imagePicker: {
    backgroundColor: '#eee',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  imagePickerText: {
    color: '#555',
  },
  selectedImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#00A65E',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
