import { Route, Routes } from "react-router-dom"
import Homepage from "../components/Homepage"
import Game from "../components/Game"
import Error from "../Page/error"


const AllRoutes = () => {
  return (
    <Routes>
        <Route  path="/" element={<Homepage />} />
        <Route  path="/game" element={<Game />} />
        <Route  path="*" element={<Error />} />
    </Routes>
  )
}

export default AllRoutes