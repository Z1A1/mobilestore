import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState, useRef, useContext } from 'react';
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
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useContext(ItemContext);
  const flatListRef = useRef(0);
  const navigation = useNavigation();
  

  
  const { id } = route.params || {}; 
  console.log('Extracted ID:', id);
  console.log('ID type:', typeof id);
  
  const getProducts = async () => {
    console.log('=== API CALL DEBUG ===');
    console.log('getProducts function called');
    console.log('ID being passed to API:', id);
    
    if (!id) {
      console.error('No ID provided, cannot fetch product details');
      setError('No product ID provided');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('About to call fetchProductdetails with ID:', id);
   
      if (typeof fetchProductdetails !== 'function') {
        console.error('fetchProductdetails is not a function');
        setError('API function not available');
        setLoading(false);
        return;
      }
      
      console.log('Calling fetchProductdetails...');
      let result = await fetchProductdetails(id);
      
      console.log('API call completed');
      console.log('API result:', result);
      console.log('Result type:', typeof result);
      
      if (!result) {
        console.error('API returned null/undefined');
        setError('No product data received');
        setLoading(false);
        return;
      }
      
      setContent(result);
      
 
      if (result.image) {
        console.log('Setting product images:', result.image);
        setProductImaage(Array.isArray(result.image) ? result.image : [result.image]);
      } else {
        console.log('No images in result');
        setProductImaage([]);
      }
      
    } catch (error) {
      console.error('=== API ERROR ===');
      console.error('Error type:', typeof error);
      console.error('Error message:', error.message);
      console.error('Full error:', error);
      console.error('Error stack:', error.stack);
      
      setError(`API Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
      console.log('API call finished, loading set to false');
    }
  };
  
  useEffect(() => {
    console.log('=== USEEFFECT DEBUG ===');
    console.log('useEffect triggered');
    console.log('Component mounted, calling getProducts');
    getProducts();
  }, [id]); 
  
  const handleScroll = event => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };
  
  const renderItem = ({ item }) => {
    return (
      <View style={{ width: width, height: 300 }}>
        <Image
          source={{ uri: item }}
          style={{ height: '100%', resizeMode: 'stretch' }}
        />
      </View>
    );
  };
  
  const handleAddToCart = () => {
    if (!content) {
      console.log('Content not loaded yet');
      return;
    }
    
    const cartItem = {
      id: content.id || id,
      name: content.name || 'Unknown Product',
      price: content.price || 0,
      image: content.image && content.image.length > 0 ? content.image[0] : null,
    };
    
    console.log('Adding to cart:', cartItem);
    addItem(cartItem);
  };
  
  // Show loading state
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Loading product details...</Text>
        <Text style={{ fontSize: 14, color: 'gray' }}>Product ID: {id}</Text>
        <TouchableOpacity 
          onPress={() => {
            console.log('Retry button pressed');
            getProducts();
          }}
          style={{ marginTop: 20, padding: 10, backgroundColor: 'blue', borderRadius: 5 }}
        >
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ fontSize: 18, color: 'red', marginBottom: 10 }}>Error Loading Product</Text>
        <Text style={{ fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 10 }}>
          {error}
        </Text>
        <Text style={{ fontSize: 14, color: 'gray', marginBottom: 20 }}>
          Product ID: {id}
        </Text>
        <TouchableOpacity 
          onPress={() => {
            console.log('Retry button pressed');
            getProducts();
          }}
          style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5, marginBottom: 10 }}
        >
          <Text style={{ color: 'white' }}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ padding: 10, backgroundColor: 'gray', borderRadius: 5 }}
        >
          <Text style={{ color: 'white' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  

  if (!content) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Product not found</Text>
        <Text style={{ fontSize: 14, color: 'gray', marginBottom: 20 }}>
          Product ID: {id}
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{ padding: 10, backgroundColor: 'gray', borderRadius: 5 }}
        >
          <Text style={{ color: 'white' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={back} style={styles.imageStyle} />
          </TouchableOpacity>
          <Text style={{ color: 'white' }}>Item Details</Text>
          <Image source={search} style={styles.imageStyle} />
          <Image source={shopping} style={styles.imageStyle} />
        </View>
      </View>
      
      {productImage.length > 0 && (
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
      )}
      
      <Text style={styles.productName}>{content.name}</Text>
      <Text style={styles.productPrice}>OMR {content.price}</Text>
      
      {content.description && (
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
          style={{ flex: 0.5, margin: 10, backgroundColor: 'grey' }}
        />
      )}
      
      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={handleAddToCart}
      >
        <Text style={styles.addToCartText}>Add to Cart</Text>
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
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 10,
  },
  productPrice: {
    color: 'red',
    fontSize: 20,
    left: 10,
    marginTop: 5,
  },
  addToCartButton: {
    backgroundColor: 'red',
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 20,
  },
});