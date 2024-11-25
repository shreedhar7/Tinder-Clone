import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { useLayoutEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-react-native-classnames";
import useAuth from "../hooks/useAuth";
import { Ionicons , Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-deck-swiper";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

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
      if(!data.exists()){
        navigation.navigate("Modal");
      }
    })
  },[]);

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
    cards={DUMMY_DATA}
    stackSize={5}
    cardIndex={0}
    animateCardOpacity
    verticalSwipe={false}
    
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
