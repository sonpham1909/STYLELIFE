import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchUserReviews} from '../../redux/actions/actionsReview';
import {fetchProductById} from '../../redux/actions/actionProduct'; // Import action lấy thông tin sản phẩm
import {StyleSheet, Text, View, Image, FlatList} from 'react-native';
import renderStars from '../../components/Home/renderStars';
import StatusView from '../../components/StatusView';

const ReviewsScreen = ({navigation}) => {
  const dispatch = useDispatch();

  // Lấy danh sách đánh giá từ Redux store
  const {
    userReviews,
    isLoading: isLoadingReviews,
    error: reviewError,
  } = useSelector(state => state.reviewResponses);
  const {
    productDetails,
    isLoading: isLoadingProduct,
    error: productError,
  } = useSelector(state => state.products);

  // Fetch danh sách đánh giá khi component được mount
  useEffect(() => {
    dispatch(fetchUserReviews());
  }, [dispatch]);

  // Fetch thông tin sản phẩm cho từng đánh giá khi `userReviews` thay đổi
  useEffect(() => {
    if (userReviews && userReviews.length > 0) {
      const productIdsToFetch = userReviews
        .map(review => review.product_id)
        .filter(productId => productId && !productDetails[productId]); // Chỉ gọi nếu product chưa tồn tại

      // Đảm bảo không gọi lại liên tục cùng một sản phẩm
      productIdsToFetch.forEach(productId => {
        if (!productDetails[productId]) {
          dispatch(fetchProductById(productId));
        }
      });
    }
  }, [userReviews, dispatch, productDetails]);

  const renderItem = ({item}) => {
    const product = productDetails[item.product_id] || {};
    const formattedDate = new Date(item.createdAt).toLocaleDateString('vi-VN'); // Lấy thông tin sản phẩm từ Redux store nếu có
    return (
      <View style={styles.cardReview}>
        <View style={styles.renderItemReview}>
          <View style={styles.imageWrapper}>
            <Image
              source={{uri: item.image_variant}}
              style={styles.imageReview}
            />
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.nameReview}>
              {product.name || 'Product Name'}
            </Text>

            <Text style={styles.priceReview}>
              {product.price !== undefined
                ? `${product.price.toLocaleString()} VND`
                : 'Giá không xác định'}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={styles.renderStarReview}>
            {renderStars(item.rating)}
          </View>
          <Text style={styles.reviewDate}>{formattedDate}</Text>
        </View>
        <Text style={styles.comment}>{item.comment}</Text>
      </View>
    );
  };


  if (isLoadingReviews || isLoadingProduct) {
    return <StatusView isLoading={true} />;
  }
    
  if (!userReviews || userReviews.length === 0 && !productDetails || productDetails.length=== 0) {
    return <StatusView emptyText="Không có nhan xet nào đã mua." />;
  }
  if (reviewError || productError) {
    return <StatusView error={reviewError||productError} />;
  }


  return (
    <View style={styles.container}>
      <FlatList
        data={userReviews}
        keyExtractor={item => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ReviewsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    justifyContent: 'center',
  },
  imageWrapper: {
    backgroundColor: '#f0f0f0', // Màu nền nhạt
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageReview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  renderItemReview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameReview: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 15,
  },
  priceReview: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#27ae60',
    marginTop: 4,
    marginHorizontal: 15,
  },
  renderStarReview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  dateReview: {
    position: 'absolute',
    right: 0,
    fontSize: 12,
    color: '#888',
  },
  comment: {
    fontSize: 14,
    color: '#555',
    margin: 5,
  },
  starIcon: {
    width: 20,
    height: 20,
    marginRight: 2,
  },
  cardReview: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  noReviewsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noReviewsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
});
