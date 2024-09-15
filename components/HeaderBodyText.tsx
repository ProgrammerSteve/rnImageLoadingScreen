import { Text, View, StyleSheet } from "react-native"

interface Props{
    header:string;
    body:string;
}

const HeaderBodyText=({header,body}:Props)=>{
    return(
        <View style={styles.container}>
            <Text style={styles.header}>{header}</Text>
            <Text style={styles.body}>{body}</Text>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      textAlign:"left",
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    body: {
      fontSize: 16,
      color:"#757575"
    },
  });

  export default HeaderBodyText
  