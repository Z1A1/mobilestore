import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,

} from 'react-native';
import React, { useEffect, useState, useRef ,useContext} from 'react';
import { useRoute } from '@react-navigation/native';
import { fetchProductdetails } from '../utilis/api';
import shopping from '../assests/gorcesory.png';
import search from '../assests/bat.png';
import back from '../assests/back.png';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
const { width, height } = Dimensions.get('window');
import { ItemContext } from '../context/ItemContext';
const Product = () => {
  const route = useRoute();
  const [productImage, setProductImaage] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
    const [content, setContent] = useState();
  const { addItem } = useContext(ItemContext);
  const flatListRef = useRef(0);
  const navigation = useNavigation();
  const { id } = route.params;
  console.log('the route', id);
  const getProducts = async () => {
    console.log('first');
    let result = await fetchProductdetails(id);
    console.log('the product details', result);
    setContent(result)
    setProductImaage(result.image);
  };
  useEffect(() => {
    getProducts();
  }, [id]);
  const handleScroll = event => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };
   const handleAddToCart = () => {
  
    
    const cartItem = {
      id: content.id || id,
      name: content.name || 'Unknown Product',
      price: content.price || 0,
      image: content.image && content.image.length > 0 ? content.image[0] : null,
    };
    
 
    addItem(cartItem);
  };
  const renderItem = ({ item }) => {
    console.log('the items are the ', item);
    return (
      <View style={{ width: width, height: 300 }}>
        <Image
          source={{ uri: item }}
          style={{ height: '100%', resizeMode: 'stretch' }}
        />
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={back} style={styles.imageStyle} />
          </TouchableOpacity>
          <Text style={{ color: 'white' }}>item Details</Text>
          <Image source={search} style={styles.imageStyle} />
          <Image source={shopping} style={styles.imageStyle} />
        </View>
      </View>
      <View style={styles.bannerComtainer}>
        <FlatList
          data={productImage}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          ref={flatListRef}
          snapToInterval={Dimensions.get('window').width}
          decelerationRate="fast"
          style={styles.bannerComtainer}
          onScroll={handleScroll}
        />
        <View style={styles.paginationContainer}>
          {productImage.length > 1 &&
            productImage.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { opacity: index === currentIndex ? 1 : 0.3 },
                ]}
              />
            ))}
        </View>
      </View>
      {content && <Text>{content.name}</Text>}
       {content && <Text style={{color:'red',fontSize:20,left:10}}> OMR {content.price}</Text>}
 {content && content.description && (

  <WebView
    originWhitelist={['*']}
    source={{
      html: `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-size: 18px; padding: 15px; color: #333; }
              img { max-width: 100%; height: auto; }
            </style>
          </head>
          <body>
            ${content.description}
          </body>
        </html>
      `,
    }}
    style={{ flex: .5 ,margin:10,backgroundColor:'grey'}}
  />
)}
<TouchableOpacity style={{backgroundColor:'red',height:50,width:'100%',alignItems:'center',justifyContent:'center'}}
onPress={handleAddToCart}

>
<Text style={{color:'white',fontSize:20}}>
Add to Cart
</Text>
</TouchableOpacity>
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 70,
    width: '100%',
    backgroundColor: 'red',
  },
  imageStyle: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  bannerComtainer: {
    flex: 0.5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginHorizontal: 5,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
});