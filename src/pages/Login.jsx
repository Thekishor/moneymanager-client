import {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {assets} from "../assets/assets.js";
import Input from "../components/Input.jsx";
import {validateEmail, validatePassword} from "../util/validation.js";
import axiosConfig from "../util/axiosConfig.js";
import {API_ENDPOINT} from "../util/apiEndpoints.js";
import {AppContext} from "../context/AppContext.jsx";
import {LoaderCircle} from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {setUser}  = useContext(AppContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!validateEmail(email)) {
            setError("Please enter your email address");
            setIsLoading(false);
            return;
        }
        if (!validatePassword(password)) {
            setError(
                "Password must be between 8 and 20 characters long, include uppercase, lowercase, number, and special character"
            );
            setIsLoading(true);
            return;
        }
        setError(null);

        //api call
        try {
            const response = await axiosConfig.post(API_ENDPOINT.LOGIN, {
                email,
                password,
            });
            const {token, user} = response.data;
            if (token) {
                localStorage.setItem("token", token);
                setUser(user);
                navigate("/dashboard");
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                console.error("Something went wrong", error);
                setError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            <img src={assets.login_bg} alt="background" className="absolute inset-0 w-full h-full object-cover filter blur-sm" />

            <div className="relative z-10 w-full max-w-lg px-6">
                <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-2xl font-semibold text-black text-center mb-2">
                        Welcome Back
                    </h3>
                    <p className="text-sm text-slate-700 text-center mb-8">
                        Please enter your details to login in
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example23@gmail.com"
                            label="Email Address"
                            type="email"
                        />

                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="**********"
                            label="Password"
                            type="password"
                        />
                        {error && (
                            <p className="text-red-800 text-sm text-center bg-red-50 p-2 rounded">
                                {error}
                            </p>
                        )}
                        <button
                            disabled={isLoading}
                            className={`w-full py-3 text-lg font-medium bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center justify-center gap-2
                                      ${isLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                            type="submit">
                            {isLoading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-5 h-5" />
                                    Logging in....
                                </>
                            ) : ("LOGIN")
                            }
                        </button>

                        <p className="text-sm text-slate-800 text-center mt-6">
                            Don&#39;t have an account?
                            <Link to="/signup" className="font-medium text-primary underline hover:text-primary-dark transition-colors">
                                Signup
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;