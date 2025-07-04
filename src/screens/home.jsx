import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  
} from 'react-native';
import React, { useEffect, useState, useRef, } from 'react';
import Hme from '../assests/home.png';
import Menu from '../assests/menu.png';
import Bell from '../assests/bell.png';
import Brand from '../assests/brand.png';
import search from '../assests/Frame.png';
import { fetchApi,fetchProduct } from '../utilis/api';
const { width, height } = Dimensions.get('window');
import { useNavigation } from '@react-navigation/native';

const IMAGE_BASE_URL = 'http://omanphone.smsoman.com/pub/media/catalog/product';
const Home = () => {
    const navigation = useNavigation();
  console.log('first');
  let index = 0;
  let nearray=[]
  const [data, setData] = useState();
    const [productdata, setproductData] = useState();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();
  const fetchBanner = async () => {
    console.log('first');
    let result = await fetchApi();
    console.log('the fetche result', result.data.slider);
    setData(result.data.slider);
  };
  const getProducts = async () => {
    console.log('first');
    let result = await fetchProduct();
    console.log('the products are', result);
 setproductData(result.map((item)=>item?.data.items))
 //result.map((item)=>console.log("here ew go",item?.data.items))
setproductData(result.flatMap(item => {
  if (item.data?.items?.length) {
    return item.data.items.map(element => ({
      name: element.name,
      id: element.id,
      price: element.price,
      image: element.image,
    }));
  }
  return [];
}))





  
  };

  useEffect(() => {
    fetchBanner();
    getProducts()
  }, []);
 

console.log("first")
  
    const autoRotate = () => {
     if (flatListRef.current && data?.length > 0) {
        let nextIndex = (currentIndex + 1) % data.length;
        flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        setCurrentIndex(nextIndex);
      }
  };
   useEffect(() => {
    const interval = setInterval(autoRotate, 4000);

    return () => clearInterval(interval);
  }, [data]);
  const renderItem = ({ item }) => {
    console.log('the items are the ', item.image);
    return (
      <View style={{ width: width }}>
        <Image
          source={{ uri: item.image }}
          style={{ height: 200, resizeMode: 'stretch' }}
        />
      </View>
    );
  };
  const renderProduct=({item})=>{
  console.log("the products are",item)
  let sourceImage=IMAGE_BASE_URL+item.image
    return(
  <TouchableOpacity style={{  margin: 10 ,width:200}}
  
  onPress={()=>navigation.navigate('Product',{id:item.id})}
  >
    <Image
            source={{ uri: sourceImage }}
            style={styles.productImage}
            resizeMode="stretch"
          />
            <Text>{item.name}</Text>
            <Text style={{color:'red'}}>OMR {item.price}</Text>
    </TouchableOpacity>
  )}
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Image source={Menu} style={styles.imageStyle} />
          <Image
            source={Brand}
            style={{
              height: 40,
              width: 40,
            }}
          />
          <Image source={Bell} style={styles.imageStyle} />
        </View>
        <Image source={search} style={styles.searchImage} />
      </View>
      <View style={styles.bannerComtainer}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          ref={flatListRef}
          snapToInterval={Dimensions.get('window').width}
          decelerationRate="fast"
        />

      </View>
      <FlatList
      style={styles.productStyle}
      data={productdata}
      keyExtractor={(item,index)=>index.toString()}
renderItem={renderProduct}
numColumns={2}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  imageStyle: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  header: {
    flex: 0.2,
    backgroundColor: 'red',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  searchImage: {
    height: 100,
    width: '100%',
    resizeMode: 'stretch',
  },
  bannerComtainer: {
    flex: 0.5,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  productStyle:{
    flex:.5
  },
  productImage:{
    
    width: 120,
    height: 120,
    marginBottom: 10,
  
  }
});
