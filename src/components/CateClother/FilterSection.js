import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import SortToggleButton from '../../components/CateClother/SortToggleButton';
import cateClotherStyles from '../../styles/cateClotherStyles';

const FilterSection = ({ selectedSize, setSelectedSize, selectedColor, setSelectedColor, selectedPrice, setSelectedPrice }) => {
    return (
        <View>
            <View style={cateClotherStyles.filterHeader}>
                <SortToggleButton />
            </View>

            <View style={cateClotherStyles.filterContainer}>
                <Text style={cateClotherStyles.filterLabel}>Bộ lọc</Text>

                <View style={cateClotherStyles.pickerWrapper}>
                    <Picker
                        selectedValue={selectedSize}
                        style={cateClotherStyles.picker}
                        onValueChange={(itemValue) => setSelectedSize(itemValue)}
                    >
                        <Picker.Item label="Kích cỡ" value="All" />
                        <Picker.Item label="S" value="S" />
                        <Picker.Item label="M" value="M" />
                        <Picker.Item label="L" value="L" />
                    </Picker>
                </View>

                <View style={cateClotherStyles.pickerWrapper}>
                    <Picker
                        selectedValue={selectedColor}
                        style={cateClotherStyles.picker}
                        onValueChange={(itemValue) => setSelectedColor(itemValue)}
                    >
                        <Picker.Item label="Màu sắc" value="All" />
                        <Picker.Item label="Đen" value="Black" />
                        <Picker.Item label="Trắng" value="White" />
                    </Picker>
                </View>

                <View style={cateClotherStyles.pickerWrapper}>
                    <Picker
                        selectedValue={selectedPrice}
                        style={cateClotherStyles.picker}
                        onValueChange={(itemValue) => setSelectedPrice(itemValue)}
                    >
                        <Picker.Item label="Giá" value="All" />
                        <Picker.Item label="Dưới 300,000" value="300" />
                        <Picker.Item label="300,000 - 500,000" value="500" />
                        <Picker.Item label="Trên 500,000" value="500+" />
                    </Picker>
                </View>
            </View>
        </View>
    );
};

export default FilterSection;