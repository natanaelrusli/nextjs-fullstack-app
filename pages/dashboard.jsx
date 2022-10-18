import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import Message from "../components/message";
import { BaTrash2Fill, BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  
  const getData = async () => {
    // see if user is logged
    if(loading) return;
    if(!user) return route.push('/auth/login');

    // if user logged in then get all of the posts of the user
    const collectionRef = collection(db, 'posts');
    const q = query(collectionRef, where('user', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    });

    return unsubscribe;
  };

  // delete post
  const deletePost = async(id) => {
    const docRef = doc(db, 'posts', id);
    await deleteDoc(docRef);
  };

  // get users data
  useEffect(() => {
    getData();
  }, [user, loading])

  return (
    <div>
      <div>
        {posts.map(post => {
          return (
          <Message { ...post } key={ post.id } >
            <div className="flex gap-4">
              <button className="text-pink-600 flex items-center justify-center gap-2 py-2 text-sm" onClick={() => deletePost(post.id)}>
                <BsTrash2Fill className="text-2xl" />
                Delete
              </button>
              <Link href={{ pathname: "/post", query: post }}>
                <button className="text-teal-600 flex items-center justify-center gap-2 py-2 text-sm">
                  <AiFillEdit className="text-2xl" />
                  Edit
                </button>
              </Link>
            </div>
          </Message>
          )
        })}
      </div>
      <button className="font-medium text-white bg-gray-800 py-2 px-4 my-6" onClick={() => auth.signOut()}>
        Sign out
      </button>
    </div>
  );
}