import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { addSearch, deleteAllSearchTerm, deleteSearchTerm, fetchSearchHistories } from '../../redux/actions/actionSearch';

const StartSearch = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [showAll, setShowAll] = useState(false); // Trạng thái để kiểm soát việc hiển thị toàn bộ danh sách hay không

    const dispatch = useDispatch();
    const { searchHistories, isLoading, error } = useSelector(state => state.search);

    // Load giỏ hàng khi mở màn hình
    useEffect(() => {
        dispatch(fetchSearchHistories());
    }, [dispatch]);

    // Khi mở màn hình này, input tìm kiếm sẽ tự động được focus
    const searchInputRef = useRef(null);
    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const handleOnSearch = () => {
        if (searchText) {
            dispatch(addSearch(searchText)).then(() => {
                dispatch(fetchSearchHistories());
                navigation.navigate('SearchScreen', { searchKeyWord: searchText }, { merge: true });
            });
        }
    };

    const handleRemoveSearch = useCallback(
        id => {
            dispatch(deleteSearchTerm(id)).then(() => {
                dispatch(fetchSearchHistories());
            });
        },
        [dispatch],
    );

    const handleRemoveAllSearch = useCallback(
       ()=> {
           
        dispatch(deleteAllSearchTerm()).then(() => {
            dispatch(fetchSearchHistories());
        });
        },
        [dispatch]
    );
       


    




    //xử lí khi người dùng click vào lịch sử tìm kiếm
    const handleClickHistorySearch = async (searchTerm) => {
       
        dispatch(addSearch(searchTerm)).then(() => {
            
            dispatch(fetchSearchHistories());
            navigation.navigate('SearchScreen', { searchKeyWord: searchTerm }, { merge: true });
        });


    }

    // Giới hạn số lượng mục hiển thị
    const displayedHistories = showAll ? searchHistories : searchHistories.slice(0, 4);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    if (searchText) {
                        setSearchText('');
                    } else {
                        navigation.goBack();
                    }
                }}>
                    <MaterialCommunityIcons
                        name="arrow-left"
                        size={24}
                        color="#00A65E"
                    />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <TextInput
                        ref={searchInputRef}
                        style={styles.searchInput}
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
                            <MaterialCommunityIcons name="close" size={18} color="#000" />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={handleOnSearch}
                    >
                        <MaterialCommunityIcons
                            name="magnify"
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {searchHistories.length > 0 && (
                <View style={styles.searchHis}>
                    {displayedHistories.map((item) => (
                        <View key={item._id} style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <TouchableOpacity
                                style={styles.searchHisItem}
                                onPress={() => handleClickHistorySearch(item.search_term)}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <MaterialCommunityIcons
                                        name="history"
                                        size={24}
                                        color="black"
                                    />
                                    <Text style={styles.searchHisItemTitle}>{item.search_term}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleRemoveSearch(item._id)}>
                                <MaterialCommunityIcons
                                    name="close"
                                    size={24}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {searchHistories.length > 4 && !showAll && (
                        <TouchableOpacity onPress={() => setShowAll(true)} style={styles.viewMoreButton}>
                            <Text style={styles.viewMoreText}>Xem thêm</Text>
                        </TouchableOpacity>
                    )}
                    {showAll && (
                        <TouchableOpacity
                            onPress={()=>handleRemoveAllSearch()}>
                            <Text style={styles.removeAllHis}>Xóa toàn bộ lịch sử</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

export default StartSearch;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    searchInput: {
        flex: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
        marginHorizontal: 10,
    },
    clearButton: {
        padding: 5,
    },
    searchButton: {
        backgroundColor: '#00A65E',
        padding: 10,
        marginLeft: 10,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#00A65E',
        borderRadius: 8,
        paddingLeft: 10,
        marginLeft: 10,
    },
    searchHis: {
        padding: 10,
    },
    searchHisItem: {
        margin: 10,

        width: '90%'
    },
    searchHisItemTitle: {
        marginLeft: 10,
    },
    viewMoreButton: {
        alignItems: 'center',
        marginVertical: 10,
    },
    viewMoreText: {
        color: '#00A65E',
        fontWeight: 'bold',
    },
    removeAllHis: {
        fontWeight: 'bold',
        alignSelf: 'center'
    }
});
