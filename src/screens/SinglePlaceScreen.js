import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Navbar from '../components/Navbar'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'
import BookingCard from '../components/BookingCard'
import axios from 'axios'
import { backendLink, red, white } from "../constants/constants"
import Carousel from 'react-native-snap-carousel';
import BookingWidget from '../components/BookingWidget'


export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);


const renderItem = ({ item }) => {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: 'white',
        width: widthPercentageToDP(100),
        height: 300,
      }}>
      <Image source={{ uri: item }} style={{ width: '100%', height: '100%' }} />
    </View>
  );
};


const SinglePlaceScreen = (props) => {
  const [place, setPlace] = useState({
    photos: [],
    perks: []
  })

  useEffect(() => {
    axios.get(`${backendLink}/places/${props.route.params.place._id}`).then(response => {
      const { data } = response;
      setPlace(data)
    })
  }, [])

  const photos = place.photos
  const perks = place.perks

  const [review, setReview] = useState([])
  const [filtered, setFiltered] = useState([])
  const [showRev, setShowRev] = useState(false)

  useEffect(() => {
    axios.get(`${backendLink}/review/getReview`).then(response => {
      const { data } = response;
      setReview(data.reverse())
      setFiltered(review.filter(checkPlace))
      if (review.filter(checkPlace).length > 0) {
        setShowRev(true)
      }
    })
  }, [place]);

  const checkPlace = (review) => {
    return review.place == place._id
  }

  return (
    <SafeAreaView>
      <Navbar />
      <ScrollView style={styles.scrollview}>
        <Text style={styles.title}>{place.title}</Text>
        <Text style={styles.address}>{place.address}</Text>
        <View>
          <Carousel
            data={photos}
            renderItem={renderItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
          />
        </View>

        <View>
          <Text style={styles.title}>Description</Text>
          <Text style={styles.body}>{place.description}</Text>
        </View>

        <View style={styles.numbers}>
          <Text style={styles.number}>Max Guests: {place.maxGuests}</Text>
          <Text style={styles.number}>Check In : {place.checkIn}</Text>
          <Text style={styles.number}>Check Out : {place.checkOut}</Text>
        </View>

        <Text style={styles.title}>Perks</Text>
        <View style={styles.perks}>
          {
            perks.map((item, index) => (
              <Text style={styles.perk} key={index}>{item}</Text>
            ))
          }
        </View>

        <View>
          <BookingWidget _id={place._id} price={place.price} />
        </View>

        <View>
          {
            !showRev ? (<></>) : (
              <>
                <View>
                  <Text style={styles.title}>Reviews</Text>
                </View>
                <View style={styles.reviews_parent}>
                  {
                    filtered.map((item, index) => (
                      <View key={index} style={styles.review}>
                        <Text style={styles.review_text}>{item.review}</Text>
                        <View style={styles.review_red}></View>
                      </View>
                    ))
                  }
                </View>
              </>
            )
          }

        </View>
        <Text style={styles.title}>Extra Info.</Text>
        <Text style={styles.body}>{place.extraInfo}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SinglePlaceScreen

const styles = StyleSheet.create({
  scrollview: {
    height: heightPercentageToDP(89),
    paddingHorizontal: 4,
  },
  img: {
    width: 120,
    height: 120
  },
  title: {
    paddingHorizontal: 2,
    fontSize: 20,
    fontWeight: '800',
  },
  address: {
    fontSize: 18,
    paddingHorizontal: 4,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
  },
  perks: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    padding: 4,
  },
  perk: {
    backgroundColor: red,
    color: white,
    borderRadius: 4,
    fontWeight: '800',
    textAlign: 'center',
    paddingVertical: 12,
    width: widthPercentageToDP(25),
    textTransform: 'capitalize'
  },
  numbers: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    padding: 8,
  },
  number: {
    width: '30%',
    textAlign: 'center',
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  body: {
    paddingHorizontal: 8,
  },
  reviews_parent: {
    padding: 8,
    display: 'flex',
    gap: 8,
  },
  review: {
    backgroundColor: '#ddd',
    display: 'flex',
    flexDirection: 'row-reverse'
  },
  review_red: {
    width: '10%',
    backgroundColor: red
  },
  review_text: {
    width: "90%",
    padding: 4,
    fontSize: 12,
  },
})