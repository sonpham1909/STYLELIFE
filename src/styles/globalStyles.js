import {StyleSheet} from 'react-native';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import spacing from '../constants/spacing';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.medium,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    color: colors.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: spacing.large,
    textAlign: 'center',
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: spacing.medium,
  },
  linkText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  orText: {
    textAlign: 'center',
    marginVertical: spacing.small,
    color: colors.black,
  },
  googleIcon: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  categoryText: {
    fontWeight: 'bold',
    color: '#333',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  floatingButton: {
    backgroundColor: 'green',
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  floatingIcon: {
    width: 25,
    height: 25,
    tintColor: '#fff',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    zIndex: 10,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  ShippingAddressContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  ShippingAddressContent: {
    padding: spacing.medium,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: spacing.medium,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding:spacing.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  AddressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    padding:spacing.medium
  },
  defaultLabel: {
    fontSize: 14,
    color: colors.primary,
    textAlign:'right',
    padding:spacing.small

  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
    marginTop: 3,
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  
  containerSetting:{
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  sectionSetting:{
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000', //đặt màu cho bóng
    shadowOffset: {width: 0, height: 2},//vị trí bóng đổ
    shadowOpacity: 0.1,//độ mờ
    shadowRadius: 8,//độ lan
    elevation: 1,//chiều cao của phần tử so với nền bóng đổ
  },
  instructionText: {
    fontSize: 18, // Kích thước chữ
    color: '#333', // Màu chữ
    fontWeight: '600', // Đậm vừa
    textAlign: 'center', // Căn giữa văn bản
  },




 

  
});

export default globalStyles;