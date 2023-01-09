import './App.scss';
import {useRef, useState} from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyB2TC2WxJL7nzHP4qlst-NXUS9-n7FK-50",
  authDomain: "superchat-b57f1.firebaseapp.com",
  projectId: "superchat-b57f1",
  storageBucket: "superchat-b57f1.appspot.com",
  messagingSenderId: "783826101855",
  appId: "1:783826101855:web:346db7c2b509ca28925dea",
  measurementId: "G-4TQBQF817Q"
})

const auth = firebase.auth()
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header className="App-header">
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom(){
  const dummy = useRef()

  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createAt').limit(25)

  const [messages] = useCollectionData(query,{idField: 'id'})

  const [formValue,setFormValue] = useState('')

  const sendMessage = async(e) => {
    e.preventDefault()
    const {uid, photoURL} = auth.currentUser
    await messagesRef.add({
      text: formValue,
      createAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('')
    dummy.current.scrollIntoView({behavior: 'smooth'})
  }

  console.log(messages)

  return (
    <>
      <div>
        {messages && messages.map(item => <ChatMessage key={item.id} message={item} />)}
        <div ref={dummy}></div>
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={e => setFormValue(e.target.value)} />
        <button type='submit'>Send</button>
      </form>
    </>
  )
}

function ChatMessage(msg){
  const {text,uid,photoURL} = msg.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'
  console.log(text)
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt='ptc' />
      <p>{text}</p>
    </div>
  )
}

export default App;
