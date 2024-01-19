import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Navigate, Link, useNavigate } from 'react-router-dom';
// import { GetCookie, SetCookie } from '../../../../swiftfolios/src/exports/CookieManagement';
import '../../css/AccessManagement/AccessManagement.css';
import { BarCode, ArrowRight2 } from '../CustomComponents/SwiftIcon/Icons';
import Pulse from '../Loader/Pulse';
import { checkLength, isEmpty, isValidEmail, isValidPan, isValidPhoneNumber } from '../../utils/Validation';
import ServerRequest from '../../utils/ServerRequest';
// import AccountRow from '../../../../swiftfolios/src/components/AccessManagement/AccountRow';


function AccessManagement() {

    const [step, setStep] = useState(1);

    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [number, setNumber] = useState('');
    const [pan, setPan] = useState('');
    const [name, setName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);


    const [timer, setTimer] = useState(0);

    const [Error1, setError1] = useState('');
    const [Error2, setError2] = useState('');


    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState(false);

    const [otpSent, setOTPSent] = useState(false);
    // const [login, setLogin] = useState(false);
    // const [accounts, setAccounts] = useState([]);
    const navigate = useNavigate()

    const handleNext = () => {
        setStep(step + 1);
    };

    useEffect(() => {
        const counter = timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
        return () => clearInterval(counter);
    }, [timer]);


    async function sendOTP() {

        if (timer > 0) {
            return;
        }

        let isValid = true;
        let errorMessage = '';

        if (step === 1) {
            if (isEmpty(email) || !isValidEmail(email)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            else {
                const data1 = await ServerRequest({
                    URL: "/access/signup/validation", data: {
                        "type": "email",
                        "value": email
                    }, method: "post"
                })
                console.log(data1);
                if (data1.server_error) {
                    navigate("/404", { state: { errorMessage: data1.message } });
                }
                if (data1.error) {
                    errorMessage = data1.message;
                    isValid = false;
                }
            }

        } else if (step === 2) {
            if (isEmpty(number) || !isValidPhoneNumber(number)) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
            else {
                const data1 = await ServerRequest({
                    URL: "/access/signup/validation", data: {
                        "type": "number",
                        "value": number
                    }, method: "post"
                })
                console.log(data1);
                if (data1.server_error) {
                    navigate("/404", { state: { errorMessage: data1.message } });
                }
                if (data1.error) {
                    errorMessage = data1.message;
                    isValid = false;
                }
            }
        }

        if (!isValid) {
            setError1(errorMessage);
            setError2('');
            return;
        }
        setLoading(true);
        setLoadingMessage('Sending one-time password...');


        const data1 = await ServerRequest({
            URL: "/access/generate-otp", data: {
                "type": step === 1 ? "email" : "number",
                "value": step === 1 ? email : number
            }, method: "post"
        })
        console.log(data1);
        if (data1.server_error) {
            navigate("/404", { state: { errorMessage: data1.message } });
        }

        if (!data1.error) {
            setTimeout(() => {
                setError1('');
                setError2('');
                setLoading(false);
                setLoadingMessage('');
                setOTPSent(true);
                setTimer(30);
            }, 2000);
        } else {
            setError1(`${step === 1 ? "Email" : "Mobile Number"} does not exist`);
            setError2('');
            setLoading(false);
            setLoadingMessage('');
        }
    }

    async function validateOtp() {


        if (isEmpty(otp) || !checkLength(otp, 6)) {
            setError1('');
            setError2("Otp Should be 6 Length");
        }
        else {
            setLoading(true);
            setLoadingMessage('Validating one time password...');

            const data1 = await ServerRequest({
                URL: "/access/validate-otp", data: {
                    "type": step === 1 ? "email" : "number",
                    "value": step === 1 ? email : number,
                    "otp": otp
                }, method: "post"
            })
            console.log(data1);
            if (data1.server_error) {
                navigate("/404", { state: { errorMessage: data1.message } });
            }

            if (!data1.error) {

                // const token = data.token;
                setTimeout(() => {
                    setTimer(0)
                    setError1('')
                    setError2('')
                    setLoading(false)
                    setLoadingMessage(false)
                    setOTPSent(false)
                    setOTP('')
                    handleNext()
                    // getAccounts(token);
                    // SetCookie('auth_token', token);
                }, 2000)


                // setLogin(true);
            }
            else {
                setTimeout(() => {
                    setError1('');
                    setError2(data1.message);
                    setLoading(false);
                    setLoadingMessage('');
                }, 1000)
            }
            // }).catch((error) => {
            //     setError1('');
            //     setError2('Something went wrong!');
            //     setLoading(false);
            //     setLoadingMessage('');
            // });
        }
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];

        setLoading(true);
        setLoadingMessage('Uploading File...');

        setTimeout(() => {
            setError1('');
            setError2('');
            setLoading(false);
            setLoadingMessage('');
            setOTPSent(true);
            // setTimer(30);
        }, 2000)

        if (file) {
            setSelectedFile(file);
            console.log(file)
        }
    };

    function KeyUp1(e) {
        if (e.key === 'Enter') {
            sendOTP();
        }
    }

    function KeyUp2(e) {
        if (e.key === 'Enter') {
            validateOtp();
        }
    }

    function KeyUp3(e) {
        if (e.key === 'Enter') {
            if (selectedFile)
                handleSubmit()
            else {
                console.log("click")
                document.getElementById('fileInput').click();
            }
        }
    }


    async function handleSubmit() {

        if (isEmpty(name)) {
            setError1('Please enter valid Name');
            setError2('')
            return;
        }
        if (isEmpty(pan) || !isValidPan(pan)) {
            setError1('')
            setError2('Please enter valid PAN number');
            return;
        }

        const data1 = await ServerRequest({
            URL: "/access/signup/validation", data: {
                "type": "pan",
                "value": pan
            }, method: "post"
        })
        console.log(data1);
        if (data1.server_error) {
            navigate("/404", { state: { errorMessage: data1.message } });
        }
        if (data1.error) {
            setError1('')
            setError2(data1.message);
            return;
        }


        const myForm = new FormData();
        myForm.append('primaryname', name);
        myForm.append('primaryemail', email);
        myForm.append('pan', pan);
        myForm.append('mobile', number);
        myForm.append('file', selectedFile);

        // console.log(myForm)
        setLoading(true);
        setLoadingMessage('Creating Account...');


        const data2 = await ServerRequest({
            URL: "/access/signup/create", data:
                myForm
            , method: "post", headers: {
                'Content-type': 'multipart/form-data',
            }
        })
        console.log(data2);
        if (data2.server_error) {
            navigate("/404", { state: { errorMessage: data2.message } });
        }
        if (data2.error) {
            setError1('')
            setError2(data2.message);
            setLoading(false);
            setLoadingMessage('');
            return;
        }

        setLoading(false);
        setLoadingMessage('');
        handleNext();
    }


    if (step === 4) {
        return <Navigate to="/home" />
    }

    return (
        <div className='user-login'>
            <div className='user-login-popup-wrapper'>
                {loading ?
                    <>
                        <div className='popup-loader'>
                            <Pulse />
                            <p>{loadingMessage}</p>
                        </div>
                    </> :
                    <>
                        <div className='login-header'>

                            {/* add home page url */}
                            <h2><Link to="/"><i>swift</i>folios</Link></h2>
                            <span>SignUp</span>
                        </div>

                        {
                            step === 1 && <> <div className='login-content'>
                                <div className='login-body'>
                                    <div className='swift-input-box'>
                                        <p>Email</p>
                                        <input className='swift-input' value={email} onChange={(e) => { setEmail(e.target.value) }} onKeyUp={KeyUp1} placeholder="Your email address" />
                                        <p className={Error1 === '' ? 'error-text hide' : 'error-text'}>{Error1}</p>
                                    </div>
                                    <div className='swift-button-icon' onClick={sendOTP}>
                                        <div className='button-icon'>
                                            <BarCode size={20} />
                                        </div>
                                        <p>Generate OTP</p>
                                    </div>
                                    {otpSent &&
                                        <>
                                            <p className={timer === 0 ? "resend-message hide" : "resend-message"}>Please wait {timer} seconds to resend</p>
                                            <div className='swift-input-box'>
                                                <p>OTP</p>
                                                <input className='swift-input' value={otp} placeholder="123456" onKeyUp={KeyUp2} maxLength={6} onChange={(e) => { setOTP(e.target.value.replace(/[^\d]/g, '')) }} />
                                                <p className={Error2 === '' ? 'error-text hide' : 'error-text'}>{Error2}</p>
                                            </div>
                                        </>
                                    }
                                </div>
                                {otpSent &&
                                    <>
                                        <div className='login-footer'>
                                            <div className='swift-button-icon' onClick={validateOtp}>
                                                <div className='button-icon'>
                                                    <ArrowRight2 size={20} />
                                                </div>
                                                <p>Next</p>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div></>
                        }


                        {
                            step === 2 && <> <div className='login-content'>
                                <div className='login-body'>
                                    <div className='swift-input-box'>
                                        <p>Mobile Number</p>
                                        <input className='swift-input' maxLength={10} type="number" value={number} onChange={(e) => { let inputValue = e.target.value; inputValue = inputValue.slice(0, 10); setNumber(inputValue) }} onKeyUp={KeyUp1} placeholder="Your mobile number" />
                                        <p className={Error1 === '' ? 'error-text hide' : 'error-text'}>{Error1}</p>
                                    </div>
                                    <div className='swift-button-icon' onClick={sendOTP}>
                                        <div className='button-icon'>
                                            <BarCode size={20} />
                                        </div>
                                        <p>Generate OTP</p>
                                    </div>
                                    {otpSent &&
                                        <>
                                            <p className={timer === 0 ? "resend-message hide" : "resend-message"}>Please wait {timer} seconds to resend</p>
                                            <div className='swift-input-box'>
                                                <p>OTP</p>
                                                <input className='swift-input' value={otp} placeholder="123456" onKeyUp={KeyUp2} maxLength={6} onChange={(e) => { setOTP(e.target.value.replace(/[^\d]/g, '')) }} />
                                                <p className={Error2 === '' ? 'error-text hide' : 'error-text'}>{Error2}</p>
                                            </div>
                                        </>
                                    }
                                </div>
                                {otpSent &&
                                    <>
                                        <div className='login-footer'>
                                            <div className='swift-button-icon' onClick={validateOtp}>
                                                <div className='button-icon'>
                                                    <ArrowRight2 size={20} />
                                                </div>
                                                <p>Next</p>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div></>
                        }


                        {
                            step === 3 && <> <div className='login-content'>
                                <div className='login-body'>
                                    <div className='swift-input-box'>
                                        <p>Name</p>
                                        <input className='swift-input' type="text" maxLength={100} value={name} onChange={(e) => { setName(e.target.value) }} placeholder="Your Name" />
                                        <p className={Error1 === '' ? 'error-text hide' : 'error-text'}>{Error1}</p>
                                    </div>
                                    <div className='swift-input-box'>
                                        <p>Pan</p>
                                        <input className='swift-input' type="text" maxLength={10} value={pan} onChange={(e) => { setPan(e.target.value.toUpperCase()) }} onKeyUp={KeyUp3} placeholder="Your pan number" />
                                        <p className={Error2 === '' ? 'error-text hide' : 'error-text'}>{Error2}</p>
                                    </div>
                                    <div className='swift-button-icon' onClick={() => { console.log("click"); document.getElementById('fileInput').click(); }}>
                                        <div className='button-icon'>
                                            <label htmlFor="fileInput">
                                                <BarCode size={20} />
                                                <input
                                                    type="file"
                                                    id="fileInput"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e)}
                                                    style={{ display: 'none' }}
                                                />
                                            </label>
                                        </div>
                                        <p>Upload Pan</p>
                                    </div>
                                    {selectedFile &&
                                        <>
                                            <p className={!selectedFile ? "resend-message hide" : "resend-message"}>{selectedFile.name}</p>
                                        </>
                                    }
                                </div>
                                {otpSent &&
                                    <>
                                        <div className='login-footer'>
                                            <div className='swift-button-icon' onClick={handleSubmit}>
                                                <div className='button-icon'>
                                                    <ArrowRight2 size={20} />
                                                </div>
                                                <p>Submit</p>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div></>
                        }
                    </>}
                <p className='footer-line'>Reach out to us if you want <span>Swift<i>folios</i></span> to be a part of your tech solution.</p>


            </div>
        </div>
    )

}

export default AccessManagement
