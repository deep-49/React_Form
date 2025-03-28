import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserManagementApp from './Page/UserManagementApp'


  const router = createBrowserRouter([
    {
      path: "/",
      element: <UserManagementApp />

    },
    
  ])

  const App = () => {
  
  
    return (
      
      <RouterProvider router={router}></RouterProvider>
    )
  }
  
  export default App
 

 
