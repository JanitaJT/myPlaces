import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Input, Header, Button, ListItem } from "react-native-elements";
import * as SQLite from "expo-sqlite";
import { getLocation } from "./MapScreen";

const db = SQLite.openDatabase("myPlacesdb.db");

export default function MyPlaces({ navigation }) {
  const [findAdress, setFindAdress] = useState("");
  const [adresses, setAdresses] = useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists myPlaces (id integer primary key not null, findAdress text);"
      );
    });
    updateList();
  }, []);

  useEffect(() => {}, [adresses]);

  const saveAdress = () => {
    db.transaction(
      (tx) => {
        tx.executeSql("insert into myPlaces (findAdress) values (?);", [
          findAdress,
        ]);
      },
      null,
      updateList
    );
  };
  const updateList = () => {
    console.log("updates list");
    db.transaction((tx) => {
      tx.executeSql("select * from myPlaces;", [], (_, { rows }) => {
        setAdresses(rows._array);
      });
    });
  };

  const deleteAdress = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql("delete from myPlaces where id = ?;", [id]);
      },
      null,
      updateList
    );
  };

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      onLongPress={() => deleteAdress(item.id)}
      onPress={() => navigation.navigate("Map", { adress: item.findAdress })}
    >
      <ListItem.Content>
        <ListItem.Title>{item.findAdress}</ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Input
          label="Place finder"
          placeholder="Find adress"
          onChangeText={(findAdress) => setFindAdress(findAdress)}
          value={findAdress}
        />
        <Button title="Save" onPress={saveAdress} />
      </View>
      <View style={{ flex: 2 }}>
        <FlatList
          keyExtractor={keyExtractor}
          data={adresses}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
