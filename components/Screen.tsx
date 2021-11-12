import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAppSelector } from '../redux/store'



const Screen: React.FC<{style?:any, center?: boolean}> = ({children, style, center}) => {
    const theme = useAppSelector(state => state.theme)
    return (
       <SafeAreaView style={[{backgroundColor: theme.BACKGROUND_COLOR, flex:1, alignItems:center? 'center':undefined, justifyContent: center ? 'center' : undefined }, style]}>
           <StatusBar style={theme.mode === 'dark' ? 'light': 'auto'} />
           {children}
       </SafeAreaView>
    )
}

export default Screen

