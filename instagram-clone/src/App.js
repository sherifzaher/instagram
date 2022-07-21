import { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import {  auth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut } from "./firebase";
import { Button, Avatar, Modal, Input } from "@mui/material";
import instance from "./axios";
import FlipMove from "react-flip-move";
import InstagramEmbed from "react-instagram-embed";
import Pusher from 'pusher-js';

function App() {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect( () => {
    onAuthStateChanged(auth, (User) => {
      if (User) {
        setUser(User);
      } else {
        setUser(null);
      }
    });
  }, []);

  const fetchPosts = async()=>{
    const res = await  instance.get('/sync');
    setPosts(res.data);
  }

  useEffect(()=>{
    fetchPosts();
  },[]);

  useEffect(()=>{
    const pusher = new Pusher('4679b42572c378d25b2a', {
      cluster: 'eu'
    });
    const channel = pusher.subscribe('posts');
    channel.bind('inserted', function(data) {
      fetchPosts();
    });

    return ()=>{
      channel.unbind('inserted');
    }
  },[]);

  const handleLogin =async (e) => {
    e.preventDefault();
    try{
      const user = await signInWithEmailAndPassword(auth, email, password);
      setOpen(false);
    }catch (err){
      console.log(err);
    }
  };

  const handleSignOut=async ()=>{
    await signOut(auth).then(()=>{
      setUser(null);
    }).catch((err)=>{
      console.log(err);
    });
  }

  const handleRegister =async (e) => {
    e.preventDefault();
    try{
      const user = (await createUserWithEmailAndPassword(auth, email, password)).user;
      setUser(user);
      setRegisterOpen(false);
    }catch (err){
      console.log(err);
    }
  };

  return (
      <div className="app">
        <Modal open={open} onClose={() => setOpen(false)}>
          <div >
            <form className="app__login">
              <center>
                <img
                    className="app__headerImage"
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt=""
                />
              </center>

              <Input
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={handleLogin}>Login</Button>
            </form>
          </div>
        </Modal>

        <Modal open={registerOpen} onClose={() => setRegisterOpen(false)}>
          <div >
            <form className="app__login">
              <center>
                <img
                    className="app__headerImage"
                    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                    alt=""
                />
              </center>
              <Input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                  placeholder="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={handleRegister}>Register</Button>
            </form>
          </div>
        </Modal>
        <div className="app__header">
          <img
              className="app__headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              alt=""
          />
          {user?.email ? (
              <div className="app__headerRight">
                <Button onClick={handleSignOut}>Logout</Button>
                <Avatar
                    className="app__headerAvatar"
                    alt={user.displayName}
                    src="/static/images/avatar/1.jpg"
                />
              </div>
          ) : (
              <form className="app__loginHome">
                <Button onClick={() => setOpen(true)}>Login</Button>
                <Button onClick={() => setRegisterOpen(true)}>Sign Up</Button>
              </form>
          )}
        </div>

        <div className="app__posts">
          <div className="app__postsLeft">
            <FlipMove>
              {posts?.map((post) => (
                  <Post
                      user={user}
                      key={post?._id}
                      postId={post?._id}
                      username={post?.user}
                      caption={post?.caption}
                      imageUrl={post?.image}
                      commentx={post?.comments}
                  />
              ))}
            </FlipMove>
          </div>
          <div className="app__postsRight">
            <InstagramEmbed
                url="https://www.instagram.com/p/B_uf9dmAGPw/"
                maxWidth={320}
                hideCaption={false}
                containerTagName="div"
                protocol=""
                injectScript
                onLoading={() => {}}
                onSuccess={() => {}}
                onAfterRender={() => {}}
                onFailure={() => {}}
            />
          </div>
        </div>
        {user?.email ? (
            <div className="app__upload">
              <ImageUpload username={user.email} />
            </div>
        ) : (
            <center>
              <h3>Login to upload</h3>
            </center>
        )}
      </div>
  );
}

export default App;
