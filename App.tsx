import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const COLORS = {primary: '#1f145c', white: '#fff'};

const App = () => {
  const [inputText,setinputText]=useState('')
  const [todos, setTodos] = useState([]);
  useEffect(() =>{
    GetTodosFromUserDevice()
  },[]);
  useEffect(() =>{
   SaveTodosToUserDevice(todos);
  },[todos]);
  const ListItem = ({todo}) => {
    return <View style={styles.listItem}>
      <View style={{flex:1}}>
    <Text style=
    {{fontWeight:'bold',fontSize:15,color:COLORS.primary,textDecorationLine:todo?.completed?"line-through":"none"}}>
        {todo?.task}</Text></View>
        {
          !todo?.completed && (
            <TouchableOpacity style={[styles.actionIcon]} onPress={()=>MarkTodoComplete(todo?.id)}>
            <Icon name='done' size={20} color={COLORS.primary}/>
          </TouchableOpacity>
)
        }
       
        <TouchableOpacity style={[styles.actionIcon,,{backgroundColor:'red'}]} onPress={()=>DeleteTodo(todo?.id)}>
          <Icon name='delete' size={20} color={COLORS.primary}/>
        </TouchableOpacity>
    </View>
  };
  const GetTodosFromUserDevice= async() => {
    try{
  const todos=await AsyncStorage.getItem('todos')
  if(todos!=null){
  setTodos(JSON.parse(todos))
  }
    }catch(e){
   console.log(error)
    }
  }
  const AddTodo=()=>{
    if(inputText==''){
    Alert.alert("Error",'Please input todo')
    }
    else{
      console.log(inputText);
      const newTodo={
        id:Math.random(),
        task:inputText,
        completed:false
      }
      setTodos([...todos,newTodo]);
      setinputText("")
    }
  
  }
  const MarkTodoComplete=(todoId)=>{
    const newTodos=todos.map((item)=>{
      if(item.id==todoId){
        return {...item, completed:true}
      }
      return item;
    })
    setTodos(newTodos);

  }
  const DeleteTodo=(todoId)=>{
    const newTodos=todos.filter((item)=>item.id!=todoId);
    setTodos(newTodos);
}
const ClearTodos=()=>{
  Alert.alert("Clear", "Clear todos ??", [{
    text:"Yes",
    onPress: ()=> setTodos([])
  },
{
  text:"No",
}])
 
}
const SaveTodosToUserDevice= async (todos)=>{
  try{
    const stringifyTodos = JSON.stringify(todos);
    await AsyncStorage.setItem('todos', stringifyTodos);
  } catch(e){
     console.log(e)
  }

}
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={styles.header}>
        <Text style={{fontWeight: 'bold', fontSize: 20, color: COLORS.primary}}>
          TODO APP
        </Text>
        <Icon name="delete" size={25} color="red"  onPress={ClearTodos}/>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={todos}
        renderItem={({item}) => <ListItem todo={item} />}
      />

      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput placeholder="ADD Todo" 
          value={inputText}
          onChangeText={text=>setinputText(text)}
          ></TextInput>
        </View>
        <TouchableOpacity onPress={AddTodo}>
          <View style={styles.iconContainer} >
            <Icon name="add" color={COLORS.white} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  actionIcon:{
    height:25,
    width:25,
    backgroundColor:'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:5,
    borderRadius:3
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    color: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
    paddingHorizontal: 20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding:20,
    backgroundColor:COLORS.white,
    flexDirection:'row',
    elevation:12,
    borderRadius:7,
    marginVertical:10,
  },
});

export default App;
