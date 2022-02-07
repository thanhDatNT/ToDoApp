import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import CustomButton from '../utils/CustomButton';
import {useSelector, useDispatch} from 'react-redux';
import {setTasks} from '../redux/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
  },
  requestPermissions: Platform.OS === 'ios',
});

export default function Task({navigation}) {
  const {tasks, taskID} = useSelector(state => state.taskReducer);
  const dispatch = useDispatch();

  const [done, setDone] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('white');
  const [showBellModal, setShowBellModal] = useState(false);
  const [bellTime, setBellTime] = useState('1');

  useEffect(() => {
    navigation.addListener('focus', () => {
      getTasks();
    });
    createChannel();
  }, []);

  const createChannel = () => {
    PushNotification.createChannel({
      channelId: 'task-channel',
      channelName: 'Test',
    });
  };

  const getTasks = () => {
    const Task = tasks.find(task => task.ID === taskID);
    if (Task) {
      setTitle(Task.Title);
      setDescription(Task.Description);
      setDone(Task.Done);
      setColor(Task.Color);
    }
  };

  const setTask = () => {
    if (title.length == 0) {
      Alert.alert('Warning', 'Please write your task title');
    } else {
      try {
        var Task = {
          ID: taskID,
          Title: title,
          Description: description,
          Done: done,
          Color: color,
        };
        const index = tasks.findIndex(task => task.ID === taskID);
        let newTasks = [];
        if (index > -1) {
          newTasks = [...tasks];
          newTasks[index] = Task;
        } else {
          newTasks = [...tasks, Task];
        }
        AsyncStorage.setItem('Tasks', JSON.stringify(newTasks))
          .then(() => {
            dispatch(setTasks(newTasks));
            Alert.alert('Success', 'Your task was saved successfully');
            navigation.goBack();
          })
          .catch(err => console.log(err));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const setTaskAlert = () => {
    PushNotification.localNotificationSchedule({
      channelId: 'task-channel',
      title: title,
      message: description,
      date: new Date(Date.now() + parseInt(bellTime) * 60 * 1000),
      allowWhileIdle: true,
    });
  };

  return (
    <ScrollView>
      <View style={styles.body}>
        <Modal
          transparent
          visible={showBellModal}
          onRequestClose={() => setShowBellModal(false)}
          animationType="slide"
          hardwareAccelerated>
          <View style={styles.centered_view}>
            <View style={styles.bell_modal}>
              <View style={styles.bell_body}>
                <Text style={styles.text}>Remind me after</Text>
                <TextInput
                  keyboardType="numeric"
                  style={styles.time_input}
                  value={bellTime}
                  onChangeText={value => setBellTime(value)}
                />
                <Text style={styles.text}>minute (s)</Text>
              </View>
              <View style={styles.bell_button}>
                <TouchableOpacity
                  style={styles.btn_cancel}
                  onPress={() => setShowBellModal(false)}>
                  <Text style={styles.text}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setTaskAlert();
                    setShowBellModal(false);
                  }}
                  style={styles.btn_accept}>
                  <Text style={styles.text}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <TextInput
          value={title}
          style={styles.input}
          placeholder="Title"
          onChangeText={value => setTitle(value)}
        />
        <TextInput
          value={description}
          style={styles.input}
          placeholder="Description"
          multiline
          onChangeText={value => setDescription(value)}
        />
        <View style={styles.color_bar}>
          <TouchableOpacity
            style={styles.color_white}
            onPress={() => setColor('white')}>
            {color === 'white' && (
              <FontAwesome5 name={'check'} size={25} color={'#000'} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.color_red}
            onPress={() => setColor('red')}>
            {color === 'red' && (
              <FontAwesome5 name={'check'} size={25} color={'#000'} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.color_blue}
            onPress={() => setColor('blue')}>
            {color === 'blue' && (
              <FontAwesome5 name={'check'} size={25} color={'#000'} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.color_green}
            onPress={() => setColor('green')}>
            {color === 'green' && (
              <FontAwesome5 name={'check'} size={25} color={'#000'} />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.extra_row}>
          <TouchableOpacity
            style={styles.extra_button}
            onPress={() => setShowBellModal(true)}>
            <FontAwesome5 name={'bell'} size={25} color={'#49E102'} />
            <Text style={styles.text}> Set notification</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.checkbox}>
          <CheckBox
            disabled={false}
            value={done}
            onValueChange={newValue => setDone(newValue)}
          />
          <Text style={styles.text}>Is done?</Text>
        </View>
        <CustomButton
          title="Save"
          color="#49E102"
          style={{width: '100%'}}
          onPressFunction={setTask}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  bell_modal: {
    width: 300,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
  bell_body: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bell_button: {
    flexDirection: 'row',
    height: 50,
  },
  btn_accept: {
    flex: 1,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#49E102',
  },
  btn_cancel: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centered_view: {
    flex: 1,
    backgroundColor: '#00000060',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    flexDirection: 'row',
    margin: 10,
  },
  color_bar: {
    flexDirection: 'row',
    height: 50,
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 10,
    marginVertical: 10,
  },
  color_white: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  color_red: {
    flex: 1,
    backgroundColor: '#f28b82',
    alignItems: 'center',
    justifyContent: 'center',
  },
  color_blue: {
    flex: 1,
    backgroundColor: '#aecbfa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  color_green: {
    flex: 1,
    backgroundColor: '#ccff90',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  extra_row: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  extra_button: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 5,
    height: 50,
    backgroundColor: '##49E102',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 18,
    margin: 10,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 18,
    color: '#000',
  },
  time_input: {
    width: 50,
    borderWidth: 1,
    borderColor: '#555555',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    textAlign: 'center',
    fontSize: 20,
    margin: 10,
  },
});
