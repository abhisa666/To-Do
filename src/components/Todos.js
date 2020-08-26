import React from 'react';
import {firestore} from '../firebase/firebase';


const delete_todo = (id)=>{
    firestore.collection('todos').doc(id).delete()
    .then(console.log("deleted"))
}

const checked = (id,fetchTodos) => {
    firestore.collection('todos').doc(id).update({
        checked: true,
    })
    .then(()=> {fetchTodos()} )
}
const uncheck = (id,fetchTodos) => {
    firestore.collection('todos').doc(id).update({
        checked: false,
    })
    .then(()=> {fetchTodos()} )

}


function Todos({todos,fetchTodos,usermail}){

    
    console.log('todos in Todos.js');
    console.log(todos);

    const dosum = (e,id,check,fetchTodos) => {
        const task = e.target;
        if(task.classList[0] === 'trash-btn'){
            const todo = task.parentElement;
            todo.classList.add("fall");
            delete_todo(id);
            todo.addEventListener('transitionend',()=>{
                todo.remove();
            })
        }else if(task.classList[0] === 'complete-btn'){
            const todo = task.parentElement;
            if(check){
                todo.classList.remove("completed");
                uncheck(id,fetchTodos);
                
            }else{
                todo.classList.add("completed");               
                checked(id,fetchTodos);
                
            }
            
            
        }
    };

    
   if(todos.length>0){

    todos.sort((a, b) => (a.date > b.date) ? 1 : ( (a.date===b.date) ? ( (a.time>b.time) ? 1 : -1) : -1 ) );
   
    return(
      todos.filter( (todo_ob) => todo_ob.user === usermail ).map( (todo_obj,i) => {
        return( 
            <div className="todo-container">
                <ul className="todo-list" onClick={(e) => { dosum(e,todo_obj._id,todo_obj.checked,fetchTodos)}}>
                    <div className={todo_obj.checked?"todo completed":"todo"}>
                        <li className="todo-item"> {todo_obj.todo} </li>
                        <li className="date">{ todo_obj.date===""? "" : todo_obj.date.split("-")[2]+"-"+todo_obj.date.split("-")[1]+"-"+todo_obj.date.split("-")[0]} </li>
                        <li className="time">{ todo_obj.time==="" ? "" : parseInt(todo_obj.time.split(":")[0]) >12 ? (parseInt(todo_obj.time.split(":")[0])-12).toString()+":"+todo_obj.time.split(":")[1]+" p.m." : todo_obj.time+" a.m." }   </li>
                        <button className="complete-btn"><i className="fa fa-check"></i></button>
                        <button className="trash-btn" ><i className="fa fa-trash"></i></button>
                    </div>
                </ul>
            </div>
 
            ); 
      })
  
    );
    
   }
   else{
      return(
  
        <div></div>
      );
   }
  }

  export default Todos;