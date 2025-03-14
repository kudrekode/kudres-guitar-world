

import {useNavigate} from "react-router-dom";

const WelcomePage:React.FC = () => {

    const navigate = useNavigate();
    const navigatetoMain = () =>  {
        navigate('/MainPage')
    }

    return (
        <div className="App">
            <h1>Kudre's Guitar World</h1>
            <button onClick={navigatetoMain}>Enter</button>
        </div>
    )
}
export default WelcomePage;