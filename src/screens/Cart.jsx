import { StyleSheet, Text, View, FlatList, Button ,Image} from 'react-native'
import React, { useContext } from 'react'
import { ItemContext } from '../context/ItemContext';

const Cart = () => {
  const { items, incrementQuantity, decrementQuantity, removeItem } = useContext(ItemContext);
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  


  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cart Items ({items.length})</Text>
      
      {items.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
                  <Image
                       source={{ uri: item.image }}
                       style={styles.bannerImage}
                     />
              <Text style={styles.itemText}>
                {item.name} (x{item.quantity}) - ₹{item.price}
              </Text>
              <Text style={styles.subtotal}>
                Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
              </Text>
              
              <View style={styles.buttonContainer}>
                <Button title="+" onPress={() => incrementQuantity(item.id)} />
                <Button title="-" onPress={() => decrementQuantity(item.id)} />
                <Button title="Remove" onPress={() => removeItem(item.id)} />
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      
      <Text style={styles.total}>Total: ₹{total.toFixed(2)}</Text>
    </View>
  )
}

export default Cart

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F0BEB4'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    color: '#666'
  },
  itemContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 5
  },
  itemText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5
  },
  subtotal: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc'
  },
  total: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8
  },
    bannerImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    borderRadius: 10,
  },
})