import { Pressable,Text, StyleSheet } from "react-native"

const ContinueBtn=()=>{
    return(
    <Pressable style={styles.btn}>
        <Text style={styles.btnTxt}>Continue</Text>
    </Pressable>)
}

const styles=StyleSheet.create({
    btn:{
        backgroundColor:"white",
        borderColor:"#ED5929",
        borderWidth:2,
        borderStyle:"solid",
        borderRadius:999,
        width:"100%",
        paddingVertical:10,
        justifyContent:"center",
        alignContent:"center",
        marginTop:10,
    },
    btnTxt:{
        color:"#ED5929",
        fontWeight:"500",
        textAlign:"center"
    }
})

export default ContinueBtn