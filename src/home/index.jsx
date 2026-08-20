import FAQContainer from '../components/FAQContainer';
import FormContainer from '../components/FormContainer';
import Navbar from '../components/Navbar';
import '../css/home.css';

export default function Home() {
    return (
        <div>
            <div className="home">
            <Navbar />
            <FormContainer />
            <FAQContainer />
            <div className="container">
                <h1>Welcome to the Home Page</h1>
            </div>
            </div>
        </div>
    )
}