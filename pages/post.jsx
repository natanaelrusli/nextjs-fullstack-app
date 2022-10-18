import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Router, { useRouter } from "next/router";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Post() {
  const [user, loading] = useAuthState(auth);
  // form state
  const [post, setPost] = useState({
    description: '',
  });
  const route = useRouter();
  const routeData = route.query;

  // submit post function
  const submitPost = async (e) => {
    e.preventDefault();

    // run validation for description length
    if (!post.description) {
      toast.error("Description Field Empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return;
    }

    if (post.description.length > 300) {
      toast.error("Description too long", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });
      return;
    }

    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, 'posts', post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() }
      // updateDoc(target document, update value)
      await updateDoc(docRef, updatedPost);
      return route.push('/');
    } else {
      // make a new post
      const collectionRef = collection(db, 'posts');
      await addDoc(collectionRef, {
          ...post,
          timestamp: serverTimestamp(),
          user: user.uid,
          avatar: user.photoURL,
          name: user.displayName
      });
      setPost({
        description: '',
      })
      return route.push('/');
    }
  }

  // check our user
  const checkUser = async() => {
    if (loading) return;
    if (!user) route.push('auth/login');
    if (routeData.id) {
      setPost({
        description: routeData.description,
        // this id field is set spesific only when editing a post
        id: routeData.id
      })
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return(
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form
        className="text-2x1 font-bold"
        onSubmit={submitPost}
      >
        <h1>
          {post.hasOwnProperty('id') ? "Edit your post" : "Create a new post"}
        </h1>
        <div className="py-2">
          <h3 className="text-lg font-medium py-2">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({...post, description: e.target.value})}
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
          ></textarea>
          <p
            // converting text color
            className={`text-cyan-600 font-medium text-sm ${post.description.length > 300 ? 'text-red-600' : ''}`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-600 text-white font-medium p-2 my-2 rounded-lg text-sm"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
