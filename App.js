/** Importing neccessary modules */
import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Button, VirtualizedList, Text, View, StyleSheet } from 'react-native';
import {loadList, saveList} from './components/Utils.js'

/** Defining design styles for the app (CSS like things) */
const styles = StyleSheet.create({
  /** Background / layout */
  container: {
    flex: 1,
    backgroundColor: '#9ca49f',
    padding: 8,
  },  
  /** Each list entry is an "item" */
  item: {
    padding: 10,
    fontSize: 25,
  },
  /** Entry font size */
  title: {
    fontSize: 22,
  },
  /** Styles for operations bar */
  operations: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

/* NOT RELATIVE WITH FETCH LIST */
// /** Initial list for the app "home screen", this is the list that will display when reset */
// const initialScientists = [
//   {name: "Alexander Graham Bell", highlighted: false},
//   {name: "Marie Curie", highlighted: false},
//   {name: "Robert Hooke", highlighted: false},
// ]

/** Bank that will be pulled from for add button */
const bankofScientists = [
  { key: "Albert Einstein"},
  { key: "Charles Darwin"},
  { key: "Nikola Tesla"},
  { key: "Galileo Galilei"},
  { key: "Sigmond Freud"},
  { key: "Hunt Morgan"},
  { key: "J. Robert Oppenheimer"},
  { key: "Alfred Kinsey"},
  { key: "Archimedes"},
  { key: "Stephen Hawking"},
  { key: "Charles Lyell"},
  { key: "Ludwig Boltzmann"},
  { key: "Edwin Hubble"},
  { key: "B.F. Skinner"},
  { key: "Alexander Graham Bell"},
  { key: "Marie Curie"},
  { key: "Robert Hooke"},
]

/** Item variable that is responsible for how each scientist displays you see as well as the selection design */
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <Text style={[styles.title, textColor]}>{item.key}</Text>
  </TouchableOpacity>
);

/** 
 * Main function that is responsible for the design, logic and drawing of the app 
 */
const MyCustomList = () => {

  /** State variables for controlling "moving pieces" */
  const [list, setlist] = useState([]);
  const [firsttime, setfirst] = useState(true);
  const [autosave, setsave] = useState(false);

  /* Empty data placeholder */
  var emptydata = [];

  /** Necessary functions for VirtualizedList */

  /** Return total number of items in the list */
  const getItemCount = (data) => list.length;

  /** Get a single item from the list */
  const getItem = (data, index) => (list[index]);

  /* Using a hook to tell the screen to do "stuff" after the screen renders */
  useEffect(() => {
    if(firsttime) {
      var url = "https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=cutchin"
      loadList(url, list, setlist);
      setfirst(false);
    }
  }, [])

  /**
   * Logic for the adding items
   */
  function addButton() {  
    /** Defining helper variables */
    let index;
    let entry;
    /** First we will get a random index for the bank of scientists to add to the list */
      do {
        /** If the list is at capacity, break so this won't run forever */
        if(list.length == bankofScientists.length){
          break;
        }
  
        index = Math.floor(Math.random() * bankofScientists.length);
        entry = bankofScientists[index];
      } while (list.some((person) => person.key == entry.key)); // this makes sure the entry is not already in the list

      /** Once you find an element that hasn't beeen added yet, add it to the list */
      const newList = list.concat({key: entry.key, highlighted: false})

      setlist(newList);
  }

  /**
   * Logic for removing items
   */
  function removeButton() {

    /** Easy function to remove all items from the list that are highlighted */
    const newList = list.filter((item) => !item.highlighted);

    setlist(newList);

  }

  /**
   * Logic for joining items
   */
  function joinButton() {

    /** Seperate items into two lists; highlighted and nonhighlighted */
    const notHighlightedItems = list.filter((item) => !item.highlighted);
    const highlightedItems = list.filter((item) => item.highlighted);

    /** Exit if there is nothing selected */
    if(highlightedItems.length == 0) return;

    let temp3;
    let temp4;

    /** Loop through all of the highlighted items in order to concatenate the names */
    highlightedItems.forEach((item, index) => {
      if (index < 1) temp3 = item.key; // so the commas get printed right
      else {
        /** Concatenate  the names of the selected items */
        temp4 = ', ' + item.key;
        temp3 = temp3 + temp4;
      }
    })

    /** Create a single entry with the concatenatation of all the names */
    const newList = notHighlightedItems.concat({key: temp3, highlighted: false});

    setlist(newList);

  }

  /** Logic for splitting apart joined items */
  function splitButton() {
    
    /** Seperate items into two lists; highlighted and nonhighlighted */
    const notHighlightedItems = list.filter((item) => !item.highlighted);
    const highlightedItems = list.filter((item) => item.highlighted);

    /** Return if there is nothing highlighted */
    if(highlightedItems.length == 0) return;

    /** Local variables to help */
    let tempList = [];
    
    /** Loop through all of the "joined" highlighted items */
    highlightedItems.forEach((item) => {
      /** Split each highlighted item based on the ',' delimiter */
      var temp3 = item.key.split(",");
      /** Now create a temp list that holds all of these split items */
      temp3.forEach((item2) => {
        tempList.push({key: item2.trim(), highlighted: false});
      })
    })

    /** Now place all the non highlighted items with the split items to create final list */
    const newList = notHighlightedItems.concat(tempList);

    setlist(newList);

  }

  /** Reset button to help debug list */
  function resetButton() {
    var newList = [];
    newList = loadList("https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=cutchin", newList, setlist);
    setlist(newList);

  }

  /** Function to save list to remote URL */
  function saveButton() {
    saveList("https://cs.boisestate.edu/~scutchin/cs402/codesnips/savejson.php?user=austinnelson445", list);
  }

  /** Function to load a saved list from URL */
  function loadButton() {
    /** Propagate list with loaded data */
    loadList("https://cs.boisestate.edu/~scutchin/cs402/codesnips/loadjson.php?user=austinnelson445",list, setlist);
  }

  /** Handles the selecting logic */
  function toggleSelect(akey){
    /** If the passed in item matches an entry in the list, add it */
    const newList = list.map((item) => {
      if(item.key == akey)
      {
        item.highlighted = !item.highlighted;
      }

      return item;
    })

    setlist(newList);
  }

  /** Responsible for drawing / updating components */
  const renderItem = ({ item }) => {
        const backgroundColor = item.highlighted ? 'red' : 'white';
        const color = item.highlighted ? 'white' : 'black';
        /** Gets item to draw */
        return (
          <Item
            item={item}
            onPress={() => {toggleSelect(item.key)}}
            backgroundColor= {{ backgroundColor }}
            textColor = {{ color }}
          />
    );
  };

  /** Handles thew view / what is displayed and attaches functions to buttons */
  var alist = <View style={styles.container}>
                <View style={styles.operations}>
                  <Button title="Add" onPress={() => addButton()}  />
                  <Button title="Remove" onPress={() => removeButton()}/>
                  <Button title="Join" onPress={() => joinButton()}/>
                  <Button title="Split" onPress={() => splitButton()}/>
                </View>
                <View style={styles.operations}>
                  <Button title="Reset" onPress={() => resetButton()}/>
                  <Button title="Save" onPress={() => saveButton()}/>
                  <Button title="Load" onPress={() => loadButton()}/>
                </View>
                <VirtualizedList
                  data={emptydata}
                  initialNumToRender={10}
                  renderItem={renderItem}
                  getItem={getItem}
                  getItemCount={getItemCount}
                />
                  </View>

  return (alist);

}

export default MyCustomList;