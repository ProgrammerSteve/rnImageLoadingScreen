import { View, StyleSheet, Text } from "react-native"
import HeaderBodyText from "./HeaderBodyText"
import BubbleStepper from "./BubbleStepper"
import ContinueBtn from "./ContinueBtn"

interface Props{
    imgIndex:number;
}

const BottomContainer=({imgIndex}:Props)=>{
    return(
    <View style={styles.bottomContainer}>
        <HeaderBodyText
            header="Explore your Network"
            body="The new networking app to change your entire experience. Create meangingful connections. Attend events. Develop a network."
        />
        <View style={{width:"30%"}}>
        <BubbleStepper numBubbles={3} selectedBubble={imgIndex}/>
        </View>
        <ContinueBtn/>

    </View>
    )
}

export default BottomContainer

const styles=StyleSheet.create({
    bottomContainer:{
        // position:"absolute",
        // bottom:0,
        marginTop:-40,
        borderTopLeftRadius:40,
        borderTopRightRadius:40,
        padding:20,
        alignItems:"center",
        gap:15,
        width:"100%",
        backgroundColor:"white"
    }
})