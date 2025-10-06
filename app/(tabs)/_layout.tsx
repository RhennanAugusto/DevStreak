import { Tabs } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabsLayout() {
  return (
        <Tabs screenOptions={
          {headerStyle: {backgroundColor: "#f5f5f5f5"}, 
           tabBarActiveTintColor:"purple",
           tabBarInactiveTintColor:"gray",
           headerShadowVisible: false,
           tabBarStyle:{
              backgroundColor: "#f5f5f5f5",
              borderTopWidth: 0,
              shadowOpacity: 0

           },
           tabBarLabelStyle:{
              fontSize: 12
           }
           


          }}>
            <Tabs.Screen name="index" options=
                {{title: "Metas de Hoje", headerTitleAlign: 'center', tabBarIcon: 
                  ({color, focused}) => {
                    return focused ? (
                       <MaterialCommunityIcons name="calendar" size={22} color={color} />
                    ) : (
                      <MaterialCommunityIcons name="calendar" size={22} color="grey" />
                    );
                  }
            }}/>

            <Tabs.Screen name="sequencias" options=
                {{title: "Sequências", headerTitleAlign: 'center', tabBarIcon: 
                  ({color, focused}) => {
                    return focused ? (
                       <MaterialCommunityIcons name="chart-line" size={22} color={color} />
                    ) : (
                       <MaterialCommunityIcons name="chart-line" size={22} color="grey" />
                    );
                  }
            }}/>

            <Tabs.Screen name="metas" options=
                {{title: "Adicione Metas", headerTitleAlign: 'center', tabBarIcon: 
                  ({color, focused}) => {
                    return focused ? (
                       <MaterialCommunityIcons name="plus-circle" size={22} color={color} />
                    ) : (
                      <MaterialCommunityIcons name="plus-circle-outline" size={22} color="grey" />
                    );
                  }
            }}/>
            
        </Tabs>
   );
} 
