import { View, StyleSheet, ViewStyle } from "react-native"

interface BubbleStepperProps{
    numBubbles:number;
    selectedBubble:number;
}
const BubbleStepper=({numBubbles,selectedBubble}:BubbleStepperProps)=>{
    const arr=Array.from({length:numBubbles})
    return(
    <View style={styles.bubbleContainer}>
        {arr.map((_,i)=>{
            return(<Step key={`step-bubble-onboarding-${i}`} isSelected={i==selectedBubble} />)
        })}
        
    </View>
    )
}

export default BubbleStepper

const styles=StyleSheet.create({
    bubbleContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    bubble:{
        borderRadius:999,
        height:10,
        aspectRatio:1,
        backgroundColor:"#CCCCCC"
    }
})

interface StepProps{
    isSelected:boolean;
}
const Step=({isSelected}:StepProps)=>{
    const selectedStyle:ViewStyle={
        backgroundColor:"#ED5929"
    }
    return(<View style={[styles.bubble, isSelected&&selectedStyle]}/>)
}