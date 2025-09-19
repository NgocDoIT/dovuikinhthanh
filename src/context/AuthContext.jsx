import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../firebase';
import {
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    where,
    getCountFromServer
} from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUserRank(null);
      if (firebaseUser) {
        localStorage.removeItem('guestName');
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // Người dùng đã tồn tại, cập nhật thông tin cơ bản và tải dữ liệu
          const firestoreData = userDocSnap.data();
          await setDoc(userDocRef, {
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          }, { merge: true });

          setUser({
            isLoggedIn: true,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            displayName: firebaseUser.displayName,
            isAdmin: firestoreData.isAdmin || false,
            parish: firestoreData.parish || '',
            deanery: firestoreData.deanery || '',
            diocese: firestoreData.diocese || '',
            highScore: firestoreData.highScore || 0,
          });
        } else {
          // SỬA LỖI: Người dùng mới, tạo hồ sơ mặc định trong Firestore
          const newUserProfile = {
            displayName: firebaseUser.displayName || 'Người dùng mới',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL || null,
            parish: '',
            deanery: '',
            diocese: '',
            highScore: 0,
            isAdmin: false, // Thêm trường isAdmin mặc định là false
            createdAt: new Date() // Thêm ngày tạo để tiện theo dõi
          };
          await setDoc(userDocRef, newUserProfile);
          setUser({
            isLoggedIn: true,
            uid: firebaseUser.uid,
            ...newUserProfile
          });
        }
      } else {
        // Không có người dùng nào đăng nhập (trạng thái khách)
        setUser({
          isLoggedIn: false,
          displayName: 'Khách',
          photoURL: null,
          highScore: 0,
        });
      }
      setLoading(false);
    });

    getRedirectResult(auth).catch((error) => {
      console.error("Lỗi khi đăng nhập qua chuyển hướng:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserProfile = async (profileData) => {
    if (!user || !user.isLoggedIn) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, profileData, { merge: true });
      setUser((prevUser) => ({ ...prevUser, ...profileData }));
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ người dùng:", error);
      throw error;
    }
  };

  const updateUserHighScore = async (newHighScore) => {
    if (!user || !user.isLoggedIn || newHighScore <= user.highScore) return;

    setUser((prevUser) => ({ ...prevUser, highScore: newHighScore }));
    setUserRank(null); 

    if (newHighScore >= 30) {
        const userDocRef = doc(db, 'users', user.uid);
        try {
            await setDoc(userDocRef, { highScore: newHighScore }, { merge: true });
        } catch (error) { 
            console.error("Lỗi khi cập nhật điểm cao trên Firestore:", error);
        }
    }
  };

  const updateGuestName = (newName) => {
    if (!user.isLoggedIn && newName) {
        setUser(prevUser => ({...prevUser, displayName: newName}));
        localStorage.setItem('guestName', newName);
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Lỗi khi bắt đầu chuyển hướng đăng nhập:", error);
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setUser(null); // Đặt lại trạng thái người dùng về null sau khi đăng xuất
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  const getLeaderboardData = async () => {
    const usersRef = collection(db, "users");
    const q = query(
        usersRef, 
        where("highScore", ">=", 30), 
        orderBy("highScore", "desc"), 
        limit(20)
    );
    
    try {
        const querySnapshot = await getDocs(q);
        const leaderboard = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        return leaderboard;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bảng xếp hạng:", error);
        return [];
    }
  };
  
  const fetchUserRank = async () => {
    if (!user || !user.isLoggedIn || user.highScore < 30) {
      setUserRank(null); 
      return;
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('highScore', '>', user.highScore));
    
    try {
        const snapshot = await getCountFromServer(q);
        const rank = snapshot.data().count + 1;
        setUserRank(rank);
    } catch (error) {
        console.error("Lỗi khi lấy thứ hạng người dùng:", error);
        setUserRank(null); 
    }
  };

  const value = {
    user,
    loading,
    userRank,
    fetchUserRank,
    updateUserProfile,
    updateGuestName,
    updateUserHighScore,
    signInWithGoogle,
    signOutUser,
    getLeaderboardData, 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
