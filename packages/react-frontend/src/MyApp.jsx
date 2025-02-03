// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {

    const [characters, setCharacters] = useState([]);
    
    function removeOneCharacter(index){
      const updated = characters.filter((character, i) => {
        return i !== index;
      });

      console.log(`${updated}`)

        const id = characters[index]["_id"];

        console.log(`Delete Request ${id}`);
        deleteUser(id)
        .then((res)=>{
          if (res.status != 204) throw new Error("Content Not Deleted");
          setCharacters(updated);})
          .catch((error) => {
          console.log(error);
        });

    }

    function deleteUser(id){
        const promise = fetch(`http://localhost:8000/users/${id}`, {method: 'DELETE'});
        return promise;
    }

    function updateList(person) {
        postUser(person)
          .then((res) => {
            if (res.status != 201) throw new Error("Content Not Created"); 
            //needed to add return for mutiline 
            return res.json();})
            .then((user) => {setCharacters([...characters, user]); console.log(`${user}`);})
          .catch((error) => {
            console.log(error);
          });
        }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
        }

    function postUser(person) {
      const promise = fetch("http://localhost:8000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(person)
        });
        
        return promise;
        }

    useEffect(() => {
      fetchUsers()
        .then((res) => res.json())
        .then((json) => setCharacters(json["users_list"]))
        .catch((error) => {
          console.log(error);
        });
    }, []);

  return (
    <div className="container">
      <Table 
        characterData={characters}
        removeCharacter={removeOneCharacter}
        />
        <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;