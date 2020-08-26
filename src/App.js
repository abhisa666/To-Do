import React, {useState,useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {firestore,auth,fireauth} from './firebase/firebase';
import TextField from '@material-ui/core/TextField';
import Todos from './components/Todos';
import Login from './components/Login';


function App() {

  const [todos,setTodos] = useState([]);
  const [user,setUser] = useState(null);
 
  // const [times,setTime] = useState([]);

  function authListner(){
    auth.onAuthStateChanged( (user) =>{
        if(user){
          setUser(user);
          console.log("user in authlistner");
          console.log(user.email);
        }else{
          setUser(null);
        }
    } );
    
  }

  function logout(){
    console.log("inside logout");
    auth.signOut();
  }


  const fetchTodos= () => {
    return firestore.collection('todos').get()
      .then(snapshot => {
        let todos=[];
        snapshot.forEach( doc => {
          const data = doc.data()
          const _id = doc.id
          console.log(data.user);
          console.log(user);
          if(user && data.user===user.email){
            console.log("inside if");
            todos.push({_id, ...data });
          }
          else{
            console.log("Inside else");
          }
          
        });
        console.log("Todos fetch from server");
        console.log(todos);
        return todos;
      })
      .then( (todos) => setTodos(todos))
  }

  const postTodo =(todo,date,time,usermail)=>{
    console.log("posting")
    
    
    return firestore.collection('todos').add({
      todo:todo,
      date:date,
      time:time,
      checked: false,
      user: usermail,
    })
    .then(()=>{fetchTodos()});

  
    
  }

  useEffect( ()=> {
    authListner();
    console.log(user);
    if(user){
      fetchTodos();
    }
   
  },[user])
  

  function addTodo(e,usermail){
    e.preventDefault();
    
    const todoInput = document.querySelector(".todo-input");
    const todo = todoInput.value;
    if(todo===''){
      return;
    }
    const dateTime =  document.querySelector(".data-time");
    const dateAndtime = dateTime.lastChild.firstChild.value;
    var date ='';
    var time = '';
    if(dateAndtime){
      date = dateAndtime.split("T")[0];
      time = dateAndtime.split("T")[1];
      console.log("date time");
    }
   

    postTodo(todo,date,time,usermail);
  
    todoInput.value ="";
    fetchTodos();

    

  }


  return (
  
    <div className="main-conatiner"> 

      {
        !user ? <Login /> :

        <div>

        <div className="heading">
          <span>{user.email} ToDo List </span>
          <button onClick={logout}>Logout</button>
        </div>
        <form>
          <input className="todo-input" type="text" ></input>

          <TextField
            id="datetime-local"
            label="Date and Time"
            type="datetime-local"
            // defaultValue={selectedDate}
            className="data-time"
            InputLabelProps={{
              shrink: true,
            }}
         />

          <button type="submit" className="todo-button" onClick={(e)=>{addTodo(e,user.email)} } >
            <i className="fa fa-plus-square"  ></i>
          </button>
        
        </form>

        {/* <DateTimePicker
          label="DateTimePicker"
          inputVariant="outlined"
          value={selectedDate}
          onChange={handleDateChange}
        /> */}

        <Todos todos={todos} fetchTodos={fetchTodos} usermail={user.email} />

        </div>
       
      }

    </div>

 
  );
}

export default App;
