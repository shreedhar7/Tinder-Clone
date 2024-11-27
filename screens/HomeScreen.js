import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";
import useAuth from "../hooks/useAuth";
import { Ionicons , Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-deck-swiper";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db, timestamp } from "../firebase";
import generateId from "../lib/generateId";

const DUMMY_DATA = [
  {
    displayName: "Shreedhar Thiruvengadan",
    job: "Software Engineer",
    photoURL:
      "https://media.licdn.com/dms/image/v2/D5603AQGyRhpsWC5MRQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731347107408?e=1738195200&v=beta&t=fOit8cdOc55wIopMAVGsR2fKenmb47ZadP5vs1WHotU",
    age: 23,
    id: 1,
  },
  {
    displayName: "Mark Zuckerberg",
    job: "Programmer",
    photoURL:
      "https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg",
    age: 39,
    id: 2,
  },
  {
    displayName: "Justin Mateen",
    job: "Software Developer",
    photoURL:
      "https://i.insider.com/606730e3856cd700198a2dd1?width=1136&format=jpeg",
    age: 37,
    id: 3,
  },
];

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [profile , setProfile] = useState('')

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => logout(),
      },
    ]);
  };

  const swipeRef = useRef();

  useLayoutEffect (() => {
    getDoc(doc(db , "users", user.uid)).then((data) =>{
      if(!data.exists()) {
        navigation.navigate("Modal");
      }
    })
  },[]);

  

  useEffect(()=>{
    let unsubscribe;

    const fetchCards = async  () => {
      

      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapShot) => snapShot.docs.map((doc) => doc.id));

      console.log(passes);
     

      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then((snapShot) => snapShot.docs.map((doc) => doc.id));
       console.log(swipes);

      const passedUserIds = passes.length > 0 ? passes : ["temp"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["temp"];

     

      unsubscribe = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapShot) => {
          setProfile(
            snapShot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );


     }
    fetchCards();
    return unsubscribe;
  },[])





  const swipeLeft = (cardIndex) => {
    if (!profile[cardIndex]) {
      return;
    }

    const userSwiped = profile[cardIndex];
    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };
  const swipeRight  = async  (cardIndex  ) => {
    if (!profile[cardIndex]) {
      return;
    }

    const userSwiped = profile[cardIndex];

      const loggedInProfile = await (
        await getDoc(doc(db, "users", user.uid))
      ).data();
      
      getDoc(doc(db,"users",userSwiped.id,"swipes",user.uid)).then((docSnap)=>{
        if(docSnap.exists()){
          setDoc(
            doc(db,"users",user.uid , "swipes" , userSwiped.id),
            userSwiped
          );
          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp,
          });
          
          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });

        }
        else{
          setDoc(
            doc(db,"users",user.uid , "swipes" , userSwiped.id),
            userSwiped
          );
        }
      })

  }

  

  return (
    <SafeAreaView style={tw.style("flex-1 mt-6")}>
      <View style={tw.style("flex-row items-center justify-between px-5")}>
        <TouchableOpacity onPress={handleLogout}>
          <Image
            style={tw.style("h-10 w-10 rounded-full")}
            source={{
              uri: "https://img.freepik.com/free-icon/user_318-159711.jpg",
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            style={tw.style("h-14 w-14")}
            source={require("../assets/logo.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>



      <View style={tw.style("flex-1 relative")}>
  <Swiper
    ref={swipeRef}
    containerStyle={{
      backgroundColor: "transparent",
    }}
    cards={profile}
    stackSize={5}
    cardIndex={0}
    animateCardOpacity
    verticalSwipe={false}
    onSwipedLeft={(cardIndex) => {
        console.log("Swipe Pass");
        swipeLeft(cardIndex);
      }}
      onSwipedRight={(cardIndex) => {
        console.log("Swipe Match");
        swipeRight(cardIndex);
      }}
    backgroundColor="#4FD0E9"
    overlayLabels={{
      left: {
        title: "NOPE",
        style: {
          label: {
            textAlign: "right",
            color: "red",
          },
        },
      },
      right: {
        title: "MATCH",
        style: {
          label: {
            color: "#4DED30",
          },
        },
      },
    }}
    renderCard={(card) => {
      return card ? (
        <View key={card.id} style={tw.style("bg-white h-3/4 rounded-xl relative")}>
          <Image
            style={tw.style("absolute top-0 h-full w-full rounded-xl")}
            source={{ uri: card.photoURL }}
          />
          <View
            style={tw.style(
              "absolute bottom-0 bg-white w-full h-20 justify-between items-center flex-row px-6 py-2 rounded-b-xl shadow-xl"
            )}
          >
            <View>
              <Text style={tw.style("text-xl font-bold")}>{card.displayName}</Text>
              <Text>{card.job}</Text>
            </View>
            <Text style={tw.style("text-2xl font-bold")}>{card.age}</Text>
          </View>
        </View>
      ) : (
        <View
          style={tw.style(
            "relative bg-white h-3/4 rounded-xl justify-center items-center shadow-xl"
          )}
        >
          <Text style={tw.style("font-bold pb-5")}>No more profiles</Text>
          <Image
            style={tw.style("h-20 w-20")}
            source={{
              uri: "https://cdn.shopify.com/s/files/1/1061/1924/products/Crying_Face_Emoji_large.png?v=1571606037",
            }}
          />
        </View>
      );
    }}
  />

  <View
    style={[
      tw.style("absolute bottom-10 flex-row justify-evenly w-full"),
      { zIndex: 10 },
    ]}
  >
    <TouchableOpacity
     onPress={() => swipeRef.current.swipeLeft()}
      style={tw.style("items-center justify-center rounded-full w-16 h-16 bg-red-200")}
    >
      <Entypo name="cross" size={24} color="red" />
    </TouchableOpacity>
    <TouchableOpacity
     onPress={() => swipeRef.current.swipeRight()}
      style={tw.style("items-center justify-center rounded-full w-16 h-16 bg-green-200")}
    >
      <Entypo name="heart" size={24} color="green" />
    </TouchableOpacity>
  </View>
</View>

    </SafeAreaView> 
  );
};

export default HomeScreen;
