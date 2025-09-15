import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {assets} from "../assets/assets.js";
import Input from "../components/Input.jsx";
import {validateEmail, validatePassword} from "../util/validation.js";
import axiosConfig from "../util/axiosConfig.js";
import {API_ENDPOINT} from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import {LoaderCircle} from "lucide-react";
import ProfilePhotoSelector from "../context/ProfilePhotoSelector.jsx";
import uploadProfileImage from "../util/uploadProfileImage.js";

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let profileImageUrl = "";
        setIsLoading(true);
        if (!fullName.trim()) {
            setError("Please enter your full name");
            setIsLoading(false);
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter your email address");
            setIsLoading(false);
            return;
        }
        if (!validatePassword(password)) {
            setError(
                "Password must be 8-20 characters with uppercase, lowercase, number and symbol"
            );
            setIsLoading(false);
            return;
        }
        setError(null);

        //api call
        try {
            if (profilePhoto) {
                const imageUrl = await uploadProfileImage(profilePhoto);
                profileImageUrl = imageUrl || "";
            }
             const response = await axiosConfig.post(API_ENDPOINT.REGISTER, {
                fullName,
                email,
                password,
                profileImageUrl,
            })
            if (response.status === 201) {
                toast.success("User registered successfully");
                navigate("/login");
            }
        } catch (error) {
            const message = error.response?.data?.message || "Unable to process request. Please try again."
            setError(message);
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
                        Create An Account
                    </h3>
                    <p className="text-sm text-slate-700 text-center mb-8">
                        Start tracking your spending&#39;s by joining with us.
                    </p>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="flex justify-center mb-6">
                            <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <Input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Kishor Pandey"
                                label="Full Name"
                                type="text"
                            />

                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example23@gmail.com"
                                label="Email Address"
                                type="email"
                            />

                            <div className="col-span-2">
                                <Input
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="**********"
                                    label="Password"
                                    type="password"
                                />
                            </div>
                        </div>
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
                                    Signing Up...
                                </>
                            ) : (
                                "SIGN UP"
                            )}
                        </button>

                        <p className="text-sm text-slate-800 text-center mt-6">
                            Already have an account?
                            <Link to="/login" className="font-medium text-primary underline hover:text-primary-dark transition-colors">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;