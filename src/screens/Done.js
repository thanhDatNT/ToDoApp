import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector, useDispatch} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {setTasks, setTaskID} from '../redux/actions';
import GlobalFont from '../utils/GlobalFont';
import CheckBox from '@react-native-community/checkbox';

export default function Done({navigation}) {
  const {tasks, taskID} = useSelector(state => state.taskReducer);
  const dispatch = useDispatch();

  const deleteTasks = id => {
    const filteredTasks = tasks.filter(tasks => tasks.ID !== taskID);
    AsyncStorage.setItem('Task', JSON.stringify(filteredTasks))
      .then(() => {
        dispatch(setTasks(filteredTasks));
        Alert.alert('Success', 'Task was deleted successfully');
      })
      .catch(err => console.error(err));
  };

  const checkTasks = (id, newValue) => {
    const index = tasks.findIndex(task => task.id === id)
    if(index>-1){
      let newTasks = [...tasks]
      newTasks[index].Done = newValue
      AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
        .then(() => {
          dispatch(setTasks(newTasks))
          Alert.alert('Success', 'Task state was modified successfully')
        })
        .catch(error => console.log(error))
    }
  }
  return (
    <View style={styles.body}>
      <FlatList
        data={tasks.filter(task => task.Done === true)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              dispatch(setTaskID(item.ID));
              navigation.navigate('Task');
            }}>
            <View style={styles.item_row}>
              <CheckBox 
              value ={item.Done}
              onValueChange={(newValue) => checkTasks(item.ID, newValue)}/>
              <View style={styles.item_content}>
                <Text
                  style={[styles.title, GlobalFont.CustomFont]}
                  numberOfLines={1}>
                  {item.Title}
                </Text>
                <Text style={styles.desc} numberOfLines={1}>
                  {item.Description}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteTasks(item.ID)}
                style={styles.delete}>
                <FontAwesome5 name={'trash'} size={24} color={'#ff3636'} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  delete: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desc: {
    color: '#999',
    margin: 4,
    fontSize: 18,
  },
  item: {
    marginHorizontal: 10,
    marginVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 4,
  },
  item_content: {
    flex: 1,
  },
  item_row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: '#000',
    margin: 4,
    fontSize: 24,
  },
});
